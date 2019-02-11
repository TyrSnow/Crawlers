import * as puppeteer from 'puppeteer';
import UrlStore from './UrlStore';
import Store from './Store';
import delay from './delay';
import Tools from './Tools';

interface IStore {
  push(data: any): void
  /** 负责在爬取结束之后把缓存的结果全部保存下来 */
  flush(output?: String): void
}

interface ICrawler {
  wait(): Promise<void>
  collect?(): Promise<Array<string>>
  crawl(): Promise<void>
  match?(url: string): Promise<string>
  next(): Promise<void>
  start(urls: string|Array<string>): Promise<void>
}

export default class Crawler {
  public failureUrls: Array<string>
  protected urls: UrlStore
  protected output: String
  protected store: IStore = new Store();
  protected browser: puppeteer.Browser
  protected page: puppeteer.Page
  protected $: Tools

  /**
   * 子类需要复写的部分
   */
  protected wait?(): Promise<void>
  protected collect?(): Promise<Array<string>>
  protected crawl?(): Promise<any>
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

        if (this.collect) {
          let urls = await this.collect(); // 从页面上找满足爬取规则的url
          this.urls.push(urls);
        }
        
        await this.next();
      } catch(e) {
        await this.failure(url);
      }
    } else {
      await this.browser.close();
    }
  }

  async start(urls: string|Array<string>, output?: String) {
    try {
      this.browser = await puppeteer.launch({
        headless: false
      });
      this.page = await this.browser.newPage();
    } catch (e) {
      console.error('browser start error: ', e);
      return;
    }
    this.output = output;
    this.urls.push(urls);
    this.$ = new Tools(this.page);
    try {
      await this.next();
      return this.store;
    } catch (e) {
      /** 记录已经爬取的内容用于下一次恢复对话 */
      this.store.flush(this.output);
    }
  }
}
