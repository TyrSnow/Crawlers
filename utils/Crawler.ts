import puppeteer from 'puppeteer';
import UrlStore from './UrlStore';
import delay from './delay';

export default class Crawler{
  public failureUrls: Array<string>
  protected urls: UrlStore
  protected store: Crawler.IStore // 由继承类提供
  protected browser: any
  protected page: any

  protected wait?(): Promise<void>
  protected collect?(): Promise<Array<string>>
  protected crawl?(): Promise<void>
  protected match?(url: string): Promise<string>
  protected crawlers: Object

  constructor() {
    this.urls = new UrlStore();
    this.failureUrls = [];
  }

  async failure(url) {
    this.failureUrls.push(url);
    await delay(1000);
    await this.next();
  }

  async next() {
    let url = this.urls.next();
    if (url) {
      try{
        await this.page.goto(url);
        await this.wait();

        if (this.match && this.crawlers) { // 允许在一个爬虫程序中包含若干个对不同类型页面的爬取
          let crawlName = await this.match(url);
          let result = await this.crawlers[crawlName]();
          this.store.push(result);
        } else {
          let result = await this.crawl();
          this.store.push(result);
        }

        let urls = await this.collect(); // 从页面上找满足爬取规则的url
        this.urls.push(urls);
        
        await this.next();
      } catch(e) {
        await this.failure(url);
      }
    } else {
      this.store.flush();
      await this.browser.close();
    }
  }

  async start(urls: string|Array<string>) {
    this.urls.push(urls);
    this.browser = await puppeteer.launch({
        headless: false
    });
    this.page = await this.browser.nextPage();
    try {
      await this.next();
    } catch(e) {
      /** 记录已经爬取的内容用于下一次恢复对话 */
      this.store.flush();
    }
  }
}
