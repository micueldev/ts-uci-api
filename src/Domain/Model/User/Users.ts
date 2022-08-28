import Collection from '@/Domain/Model/Collection';
import User from '@/Domain/Model/User/User';

class Users extends Collection {
  private users: Array<User>;

  constructor(users: Array<User>) {
    super();
    this.users = users;
  }

  public all(): Array<User> {
    return this.users;
  }
}

export default Users;
