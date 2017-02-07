export interface Serializer<T> {
  deserialize(data: any): T;
  serialize(): any;
}
export class Resource implements Serializer<Resource> {
  id: string;
  schemas: string[];
  meta: Meta;
  data: any;

  constructor() {
    this.meta = new Meta();
    this.schemas = [];
  }

  deserialize(data: any): Resource {
    this.data = data;
    this.id = data.id;
    this.schemas = data.schemas;
    this.meta = new Meta().deserialize(data.meta);
    return this;
  }

  at(name: string): string {
    return this.data[name];
  }

  any(name: string): any {
    return this.data[name];
  }

  serialize(): any {
    return null;
  }
}

export class Meta implements Serializer<Meta> {
  resourceType: string;
  created: string;
  lastModified: string;
  location: string;
  version: string;

  deserialize(meta: any): Meta {
    if (meta != null) {
      this.resourceType = meta.resourceType;
      this.created = meta.created;
      this.lastModified = meta.lastModified;
      this.location = meta.location;
      this.version = meta.version;
    }

    return this;
  }

  serialize(): any {
    return null;
  }
}
