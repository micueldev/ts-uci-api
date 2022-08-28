import CriteriaWithId from '@/Domain/Model/CriteriaWithId';

class UserCriteria extends CriteriaWithId {
  private username: string | null = null;
  private email: string | null = null;

  public constructor() {
    super();
  }

  public static createByUsername<T extends UserCriteria>(
    this: new () => T,
    username: string,
  ): T {
    return new this().filterByUsername(username);
  }

  public filterByUsername(username: string): this {
    this.username = username;
    return this;
  }

  public getUsername(): string | null {
    return this.username;
  }

  public static createByEmail<T extends UserCriteria>(
    this: new () => T,
    email: string,
  ): T {
    return new this().filterByEmail(email);
  }

  public filterByEmail(email: string): this {
    this.email = email;

    return this;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public getAllParams() {
    return {
      username: this.getUsername(),
      email: this.getEmail(),
    };
  }
}

export default UserCriteria;
