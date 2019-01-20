import Crawler from '..';

export default class PoetryCrawler extends Crawler {
  async wait() {

  }

  async collect() {
    return [];
  }

  async crawl() {
    let text = await this.$.collectAttrs('body');

    return text;
  }
}