export default class UniqueList {
  public length: number
  constructor(
    protected list = []
  ) {
    this.length = this.list.length;
  }
  private push_item(str: string) {
    if (this.list.indexOf(str) === -1) {
      this.list.push(str);
      this.length++;
    }
  }

  push(str: string|Array<string>): UniqueList {
    if (typeof(str) === 'string') {
      this.push_item(str);
    } else {
      str.map(this.push_item.bind(this));
    }
    return this;
  }

  get(index: number): string {
    return this.list[index];
  }

  toArray(): Array<string> {
    return this.list;
  }
}