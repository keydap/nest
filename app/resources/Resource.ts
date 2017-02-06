export interface Unmarshaller<T> {
  unmarshall(data: any): T;
}
export class Resource implements Unmarshaller<Resource> {
  id: string;
  schemas: string[];
  meta: Meta;
  data: any;

  constructor() { }

  unmarshall(data: any): Resource {
    this.data = data;
    this.id = data.id;
    this.schemas = data.schemas;
    this.meta = new Meta().unmarshall(data.meta);
    return this;
  }

  at(name: string): string {
    return this.data[name];
  }

  any(name: string): any {
    return this.data[name];
  }

}

export class Meta implements Unmarshaller<Meta> {
  resourceType: string;
  created: string;
  lastModified: string;
  location: string;
  version: string;

  unmarshall(meta: any): Meta {
    if (meta != null) {
      this.resourceType = meta.resourceType;
      this.created = meta.created;
      this.lastModified = meta.lastModified;
      this.location = meta.location;
      this.version = meta.version;
    }

    return this;
  }

}
