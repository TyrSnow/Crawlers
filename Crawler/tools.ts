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

    return Promise.all($doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.getAttribute('href'), $dom);
    }));
  }
  
  /**
   * 采集图片
   * @param selector 
   */
  async collectImage(selector: string): Promise<Array<any>> {
    let $doms = await this.page.$$(`${selector} img`);

    return Promise.all($doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.getAttribute('src'), $dom);
    }));
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
    
    return Promise.all($doms.map(async $dom => {
      return await this.page.evaluate(dom => dom.innerText, $dom);
    }));
  }

  /**
   * 采集页面上的表格
   * @param selector 
   * @param row 
   * @param columns 
   */
  async collectTable(selector, row, columns) {
    let $table = await this.page.$(selector);
    return await this.page.evaluate(($table, row, columns) => {
      let $rows = $table.querySelectorAll(row);
      let rows = [];
      $rows.forEach($row => {
        let row = {};
        for (let column of columns) {
          let $col = $row.querySelector(column.selector);
          row[column.index] = column.collect ? column.collect($col) : $col.innerText;
        }
        rows.push(row);
      });

      return rows;
    }, $table, row, columns);
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

  async waitForSelector(selector, option?) {
    return this.page.waitForSelector(selector, option);
  }

  /**
   * 等待testor返回true
   */
  async waitForTestor(testor) {
    return new Promise(async (resolve, reject) => {
      tick();

      async function tick() {
        if (await testor()) {
          return resolve();
        } else {
          setTimeout(tick, 500)
        }
      }
    });
  }
}
