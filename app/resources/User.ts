import { Resource } from "./Resource"
import { Input } from '@angular/core';
import { Serializer } from "./Resource"

export class User extends Resource implements Serializer<User> {
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

  static schemaId = "urn:ietf:params:scim:schemas:core:2.0:User";

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

  deserialize(data: any): User {
    super.deserialize(data);
    this.userName = data.userName;
    this.name = new Name().deserialize(data.name);
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
    this.enterpriseUser = new EnterpriseUser().deserialize(data[EnterpriseUser.schemaId]);

    return this;
  }
  serialize(): any {
    return this._serialize(false);
  }

  private _serialize(forPatch: boolean): any {
    let clone: User = Object.create(new User());
    //let clone = Object.assign({}, this);
    Object.assign(clone, this);
    if (!forPatch) {
      clone.schemas.push(User.schemaId);
    }

    let eu = clone.enterpriseUser;
    if (eu.serialize() != null) {
      clone[EnterpriseUser.schemaId] = eu;
      if (!forPatch) {

        clone.schemas.push(EnterpriseUser.schemaId);
      }
    }

    delete clone.enterpriseUser;
    delete clone.data;

    return clone;
  }

  serializeForPatch(): any {
    return this._serialize(true);
  }
}

export class Name implements Serializer<Name> {
  formatted: string;
  familyName: string;
  givenName: string;
  middleName: string;
  honorificPrefix: string;
  honorificSuffix: string;

  deserialize(name: any): Name {
    if (name != null) {
      this.formatted = name.formatted;
      this.familyName = name.familyName;
      this.givenName = name.givenName;
      this.middleName = name.middleName;
      this.honorificPrefix = name.honorificPrefix;
      this.honorificSuffix = name.honorificSuffix;
    }

    return this;
  }

  serialize(): any {
    if (this.formatted == null && this.familyName == null
      && this.givenName == null && this.middleName == null
      && this.honorificPrefix == null && this.honorificSuffix == null) {
      return null;
    }

    return this;
  }
}

export class ValueTypeAt implements Serializer<ValueTypeAt> {
  value: string;
  display: string;
  type: string;
  primary: boolean;

  deserialize(vt: any): ValueTypeAt {
    if (vt != null) {
      this.value = vt.value;
      this.display = vt.display;
      this.type = vt.type;
      this.primary = vt.primary;
    }

    return this;
  }
  serialize(): any {
    if (this.value == null && this.display == null
      && this.type == null) {
      return null;
    }

    return this;
  }
}

export class Email extends ValueTypeAt implements Serializer<Email> {
  deserialize(email: any): Email {
    super.deserialize(email);
    return this;
  }

  static parseArr(emails: any): Email[] {
    let arr = new Array<Email>();
    if (emails != null) {
      let i = 0;
      for (let e of emails) {
        arr[i] = new Email().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class PhoneNumber extends ValueTypeAt implements Serializer<PhoneNumber> {
  deserialize(phone: any): PhoneNumber {
    super.deserialize(phone);
    return this;
  }
  static parseArr(phones: any): PhoneNumber[] {
    let arr = new Array<PhoneNumber>();
    if (phones != null) {
      let i = 0;
      for (let e of phones) {
        arr[i] = new PhoneNumber().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class Im extends ValueTypeAt implements Serializer<Im> {
  deserialize(im: any): Im {
    super.deserialize(im);
    return this;
  }
  static parseArr(ims: any): Im[] {
    let arr = new Array<Im>();
    if (ims != null) {
      let i = 0;
      for (let e of ims) {
        arr[i] = new Im().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class Photo extends ValueTypeAt implements Serializer<Photo> {
  deserialize(photo: any): Im {
    super.deserialize(photo);
    return this;
  }
  static parseArr(photos: any): Photo[] {
    let arr = new Array<Photo>();
    if (photos != null) {
      let i = 0;
      for (let e of photos) {
        arr[i] = new Photo().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class Entitlement extends ValueTypeAt implements Serializer<Entitlement> {
  deserialize(et: any): Entitlement {
    super.deserialize(et);
    return this;
  }

  static parseArr(ets: any): Entitlement[] {
    let arr = new Array<Entitlement>();
    if (ets != null) {
      let i = 0;
      for (let e of ets) {
        arr[i] = new Entitlement().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class Role extends ValueTypeAt implements Serializer<Role> {
  deserialize(r: any): Role {
    super.deserialize(r);
    return this;
  }

  static parseArr(roles: any): Role[] {
    let arr = new Array<Role>();
    if (roles != null) {
      let i = 0;
      for (let e of roles) {
        arr[i] = new Role().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class X509Certificate extends ValueTypeAt implements Serializer<X509Certificate> {
  deserialize(x509: any): Role {
    super.deserialize(x509);
    return this;
  }

  static parseArr(certs: any): X509Certificate[] {
    let arr = new Array<X509Certificate>();
    if (certs != null) {
      let i = 0;
      for (let e of certs) {
        arr[i] = new X509Certificate().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class Address implements Serializer<Address>
{
  formatted: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  type: string;

  deserialize(ad: any): Address {
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
        arr[i] = new Address().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    if (this.formatted == null && this.streetAddress == null
      && this.locality == null && this.region == null
      && this.postalCode == null && this.country == null
      && this.type == null) {
      return null;
    }

    return this;
  }
}

export class RefTypeAt implements Serializer<RefTypeAt> {
  value: string;
  $ref: string;
  display: string;
  type: string;

  deserialize(rt: any): RefTypeAt {
    if (rt != null) {
      this.value = rt.value;
      this.$ref = rt.$ref;
      this.display = rt.display;
      this.type = rt.type;
    }

    return this;
  }

  serialize(): any {
    if (this.value == null && this.$ref == null
      && this.display == null && this.type == null) {
      return null;
    }

    return this;
  }
}

export class Group extends RefTypeAt implements Serializer<Group> {
  deserialize(g: any): Group {
    super.deserialize(g);
    return this;
  }
  static parseArr(groups: any): Group[] {
    let arr = new Array<Group>();
    if (groups != null) {
      let i = 0;
      for (let e of groups) {
        arr[i] = new Group().deserialize(e);
        i++;
      }
    }
    return arr;
  }

  serialize(): any {
    return super.serialize();
  }
}

export class EnterpriseUser implements Serializer<EnterpriseUser> {
  employeeNumber: string;
  costCenter: string;
  organization: string;
  division: string;
  department: string;
  manager: Manager;

  static schemaId = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";

  constructor() {
    this.manager = new Manager();
  }

  deserialize(eu: any): EnterpriseUser {
    if (eu != null) {
      this.employeeNumber = eu.employeeNumber;
      this.costCenter = eu.costCenter;
      this.organization = eu.organization;
      this.division = eu.division;
      this.department = eu.department;
      this.manager = new Manager().deserialize(eu.manager);
    }

    return this;
  }

  serialize(): any {
    if (this.employeeNumber == null && this.costCenter == null
      && this.organization == null && this.division == null
      && this.department == null && this.manager.serialize() == null) {
      return null;
    }

    return this;
  }
}

export class Manager implements Serializer<Manager> {
  value: string;
  $ref: string;
  displayName: string;

  deserialize(m: any): Manager {
    if (m != null) {
      this.value = m.value;
      this.$ref = m.$ref;
      this.displayName = m.displayName;
    }

    return this;
  }

  serialize(): any {
    if (this.value == null && this.$ref == null && this.displayName == null) {
      return null;
    }

    return this;
  }
}
