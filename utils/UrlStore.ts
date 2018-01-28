import UniqueList from './uniqueList';
/**
 * 
 */
export default class UrlStore extends UniqueList {
  private cur: number
  constructor(
    list = []
  ) {
    super(list);
    this.cur = this.list.length - 1;
  }

  next(): string {
    if (this.cur < this.list.length) {
      let nextUrl = this.list[this.cur];
      this.cur++;
      return nextUrl;
    }
    return;
  }
}
