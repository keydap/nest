import {Injectable} from "@angular/core"
import {ServiceProvider} from "./ServiceProvider"

@Injectable()
export class ServiceProviderService {
  public srvProviders: ServiceProvider[];
}
