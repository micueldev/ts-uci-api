import BaseModel from '@/Domain/Model/BaseModel';

class User extends BaseModel {
  public username!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  private password!: string;
  public isActive = true;

  setPassword(password: string): void {
    this.password = password;
  }

  getPassword(): string {
    return this.password;
  }
}

export default User;
