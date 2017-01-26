export class Resource {
  constructor(public data: any) { }

  id(): string {
    return this.data.id;
  }

  schemas(): string[] {
    return this.data.schemas;
  }

  meta(): Meta {
    let md = this.data.meta;
    if (md == null) {
      return null;
    }

    return new Meta(md);
  }

  at(name: string): string {
    return this.data[name];
  }
}

export class Meta {
  constructor(public data: any) { }
}
