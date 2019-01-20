import { Page } from 'puppeteer';

/** 包装一下page对象 */
export default class Tools {
  constructor(
    private page: Page
  ) {}

  /**
   * 采集链接
   * TODO: 检查选择器需不需要补一个a标签
   * @param selector 
   */
  async collectLinks(selector: string): Promise<Array<any>> {
    let $doms = await this.page.$$(`${selector} a`);

    return $doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.getAttribute('href'), $dom);
    });
  }
  
  /**
   * 采集图片
   * @param selector 
   */
  async collectImage(selector: string): Promise<Array<any>> {
    let $doms = await this.page.$$(`${selector} img`);

    return $doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.getAttribute('src'), $dom);
    });
  }

  /**
   * 获取dom的属性值s
   * @param selector 
   */
  async collectAttrs(selector: string): Promise<Array<any>> {
    let $doms = await this.page.$$(selector);

    return await Promise.all($doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.attributes, $dom);
    }));
  }

  /**
   * 采集页面上文本
   * @param selector 
   */
  async collectText(selector) {
    let $doms = await this.page.$$(selector);
    
    return $doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.innerText, $dom);
    });
  }

  /**
   * 采集HTML代码
   * @param selector 
   */
  async collectHtml(selector) {

  }

  /**
   * 截图
   * @param selector 
   */
  async collectCapture(selector) {

  }

  /**
   * 判断可视
   * @param selector 
   */
  async isVisible(selector) {

  }

  /**
   * 判断存在
   */
  async isExist(selector) {

  }
}
