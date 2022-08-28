import User from '@/Domain/Model/User/User';

class UserFactory {
  public static createNewUser({
    username = 'user',
    firstName = 'Name',
    lastName = 'Last Name',
    email = 'user@email.com',
    password = '123456',
    isActive = true,
  }: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
  }): User {
    const user = new User();
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.isActive = isActive;
    user.setPassword(password);

    return user;
  }

  public static createRandomUser(): User {
    const id = Math.ceil(Math.random() * 10000);

    const user = this.createNewUser({
      username: `user${id}`,
      email: `user${id}@email.com`,
    });
    user.id = id;

    return user;
  }
}

export default UserFactory;
