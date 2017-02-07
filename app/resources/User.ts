import { Resource } from "./Resource"
import { Input } from '@angular/core';
import { Unmarshaller } from "./Resource"

export class User extends Resource implements Unmarshaller<User> {
  userName: string;
  name: Name;
  displayName: string;
  nickName: string;
  profileUrl: string;
  title: string;
  userType: string;
  preferredLanguage: string;
  locale: string;
  timezone: string;
  active: boolean;
  password: string;
  emails: Email[];
  phoneNumbers: PhoneNumber[];
  ims: Im[];
  photos: Photo[];
  addresses: Address[];
  groups: Group[];
  entitlements: Entitlement[];
  roles: Role[];
  x509Certificates: X509Certificate[];
  enterpriseUser: EnterpriseUser;

  static schemaId="urn:ietf:params:scim:schemas:core:2.0:User";

  constructor() {
    super();
    this.name = new Name();
    this.emails = [];
    this.phoneNumbers = [];
    this.ims = [];
    this.photos = [];
    this.addresses = [];
    this.groups = [];
    this.entitlements = [];
    this.roles = [];
    this.x509Certificates = [];
    this.enterpriseUser = new EnterpriseUser();
  }

  unmarshall(data: any): User {
    super.unmarshall(data);
    this.userName = data.userName;
    this.name = new Name().unmarshall(data.name);
    this.displayName = data.displayName;
    this.nickName = data.nickName;
    this.profileUrl = data.profileUrl;
    this.title = data.title;
    this.userType = data.userType;
    this.preferredLanguage = data.preferredLanguage;
    this.locale = data.locale;
    this.timezone = data.timezone;
    this.active = data.active;
    this.password = data.password;
    this.emails = Email.parseArr(data.emails);
    this.phoneNumbers = PhoneNumber.parseArr(data.phoneNumbers);
    this.ims = Im.parseArr(data.ims);
    this.photos = Photo.parseArr(data.photos);
    this.addresses = Address.parseArr(data.addresses);
    this.groups = Group.parseArr(data.groups);
    this.entitlements = Entitlement.parseArr(data.entitlements);
    this.roles = Role.parseArr(data.roles);
    this.x509Certificates = X509Certificate.parseArr(data.x509Certificates);
    this.enterpriseUser = new EnterpriseUser().unmarshall(data.enterpriseUser);

    return this;
  }
}

export class Name implements Unmarshaller<Name> {
  formatted: string;
  familyName: string;
  givenName: string;
  middleName: string;
  honorificPrefix: string;
  honorificSuffix: string;

  unmarshall(name: any): Name {
    if (name != null) {
      this.formatted = name.formatted;
      this.familyName = name.familyName;
    }

    return this;
  }
}

export class ValueTypeAt implements Unmarshaller<ValueTypeAt> {
  value: string;
  display: string;
  type: string;
  primary: boolean;

  unmarshall(vt: any): ValueTypeAt {
    if (vt != null) {
      this.value = vt.value;
      this.display = vt.display;
      this.type = vt.type;
      this.primary = vt.primary;
    }

    return this;
  }
}

export class Email extends ValueTypeAt implements Unmarshaller<Email> {
  unmarshall(email: any): Email {
    super.unmarshall(email);
    return this;
  }

  static parseArr(emails: any): Email[] {
    let arr = new Array<Email>();
    if (emails != null) {
      let i = 0;
      for (let e of emails) {
        arr[i] = new Email().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class PhoneNumber extends ValueTypeAt implements Unmarshaller<PhoneNumber> {
  unmarshall(phone: any): PhoneNumber {
    super.unmarshall(phone);
    return this;
  }
  static parseArr(phones: any): PhoneNumber[] {
    let arr = new Array<PhoneNumber>();
    if (phones != null) {
      let i = 0;
      for (let e of phones) {
        arr[i] = new PhoneNumber().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class Im extends ValueTypeAt implements Unmarshaller<Im> {
  unmarshall(im: any): Im {
    super.unmarshall(im);
    return this;
  }
  static parseArr(ims: any): Im[] {
    let arr = new Array<Im>();
    if (ims != null) {
      let i = 0;
      for (let e of ims) {
        arr[i] = new Im().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class Photo extends ValueTypeAt implements Unmarshaller<Photo> {
  unmarshall(photo: any): Im {
    super.unmarshall(photo);
    return this;
  }
  static parseArr(photos: any): Photo[] {
    let arr = new Array<Photo>();
    if (photos != null) {
      let i = 0;
      for (let e of photos) {
        arr[i] = new Photo().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class Entitlement extends ValueTypeAt implements Unmarshaller<Entitlement> {
  unmarshall(et: any): Entitlement {
    super.unmarshall(et);
    return this;
  }

  static parseArr(ets: any): Entitlement[] {
    let arr = new Array<Entitlement>();
    if (ets != null) {
      let i = 0;
      for (let e of ets) {
        arr[i] = new Entitlement().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class Role extends ValueTypeAt implements Unmarshaller<Role> {
  unmarshall(r: any): Role {
    super.unmarshall(r);
    return this;
  }

  static parseArr(roles: any): Role[] {
    let arr = new Array<Role>();
    if (roles != null) {
      let i = 0;
      for (let e of roles) {
        arr[i] = new Role().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class X509Certificate extends ValueTypeAt implements Unmarshaller<X509Certificate> {
  unmarshall(x509: any): Role {
    super.unmarshall(x509);
    return this;
  }

  static parseArr(certs: any): X509Certificate[] {
    let arr = new Array<X509Certificate>();
    if (certs != null) {
      let i = 0;
      for (let e of certs) {
        arr[i] = new X509Certificate().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class Address implements Unmarshaller<Address>
{
  formatted: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  type: string;

  unmarshall(ad: any): Address {
    if (ad != null) {
      this.formatted = ad.formatted;
      this.streetAddress = ad.streetAddress;
      this.locality = ad.locality;
      this.region = ad.region;
      this.postalCode = ad.postalCode;
      this.country = ad.country;
      this.type = ad.type;
    }

    return this;
  }

  static parseArr(ads: any): Address[] {
    let arr = new Array<Address>();
    if (ads != null) {
      let i = 0;
      for (let e of ads) {
        arr[i] = new Address().unmarshall(e);
        i++;
      }
    }
    return arr;
  }

}

export class RefTypeAt implements Unmarshaller<RefTypeAt> {
  value: string;
  $ref: string;
  display: string;
  type: string;

  unmarshall(rt: any): RefTypeAt {
    if (rt != null) {
      this.value = rt.value;
      this.$ref = rt.$ref;
      this.display = rt.display;
      this.type = rt.type;
    }

    return this;
  }
}

export class Group extends RefTypeAt implements Unmarshaller<Group> {
  unmarshall(g: any): Group {
    super.unmarshall(g);
    return this;
  }
  static parseArr(groups: any): Group[] {
    let arr = new Array<Group>();
    if (groups != null) {
      let i = 0;
      for (let e of groups) {
        arr[i] = new Group().unmarshall(e);
        i++;
      }
    }
    return arr;
  }
}

export class EnterpriseUser implements Unmarshaller<EnterpriseUser> {
  employeeNumber: string;
  costCenter: string;
  organization: string;
  division: string;
  department: string;
  manager: Manager;

  static schemaId="urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";

  constructor() {
    this.manager = new Manager();
  }

  unmarshall(eu: any): EnterpriseUser {
    if(eu != null) {
      this.employeeNumber = eu.employeeNumber;
      this.costCenter = eu.costCenter;
      this.organization = eu.organization;
      this.division = eu.division;
      this.department = eu.department;
      this.manager = new Manager().unmarshall(eu.manager);
    }

    return this;
  }
}

export class Manager implements Unmarshaller<Manager> {
  value: string;
  $ref: string;
  displayName: string;

  unmarshall(m: any): Manager {
    if(m != null) {
      this.value = m.value;
      this.$ref = m.$ref;
      this.displayName = m.displayName;
    }

    return this;
  }
}
