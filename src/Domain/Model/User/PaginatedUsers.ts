import PaginatedCollection from '@/Domain/Model/PaginatedCollection';
import Users from '@/Domain/Model/User/Users';

class PaginatedUsers extends PaginatedCollection {
  private users!: Users;

  public constructor(users: Users, total: number) {
    super();
    this.users = users;
    this.total = total;
  }

  public getUsers(): Users {
    return this.users;
  }
}

export default PaginatedUsers;
