import Crawler from '..';

export default class PoetryCrawler extends Crawler {
  async wait() {
    await this.$.waitForSelector('#listnav');
  }

  async collect() {
    let urls = await this.$.collectLinks('#listnav');
    console.debug('urls: ', urls);
    return urls;
  }

  async crawl() {
    // let text = await this.$.collectAttrs('body');
    let rows = await this.$.collectTable('#list tbody', 'tr', [
      {
        index: 'ip',
        select: 'td:nth(0)'
      }
    ]);

    console.debug('ips: ', rows);
    return rows;
  }
}