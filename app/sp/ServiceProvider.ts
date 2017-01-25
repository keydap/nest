export class ServiceProvider {
  public id: string;
  public secret: string;
  constructor(public redirectUri: string, public desc: string) {
  }
}
