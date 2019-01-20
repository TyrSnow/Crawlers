interface IStore {
  push(data: any): void
  /** 负责在爬取结束之后把缓存的结果全部保存下来 */
  flush(): void
}

interface ICrawler{
  wait(): Promise<void>
  collect?(): Promise<Array<string>>
  crawl(): Promise<void>
  match?(url: string): Promise<string>
  next(): Promise<void>
  start(urls: string|Array<string>): Promise<void>
}