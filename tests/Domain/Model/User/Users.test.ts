import UserFactory from '~/Domain/Model/User/UserFactory';

import Users from '@/Domain/Model/User/Users';
import PaginatedUsers from '@/Domain/Model/User/PaginatedUsers';

describe('Test Users', () => {
  it('test new user', async () => {
    const user = UserFactory.createNewUser({});
    expect(user.username).toEqual('user');
    expect(user.firstName).toEqual('Name');
    expect(user.lastName).toEqual('Last Name');
    expect(user.email).toEqual('user@email.com');
    expect(user.getPassword()).toEqual('123456');
    expect(user.isActive).toBeTruthy();
  });

  it('test with user', async () => {
    const user = UserFactory.createNewUser({});
    user.id = 1;

    const users = new Users([user]);
    expect(users.count()).toEqual(1);
    expect(users.isEmpty()).toBeFalsy();
    expect(users.allIndexedById()[1].id).toEqual(user.id);
  });

  it('test without user', async () => {
    const users = new Users([]);
    expect(users.count()).toEqual(0);
    expect(users.isEmpty()).toBeTruthy();
    expect(users.allIndexedById()).toEqual([]);
  });

  it('test paginated users', async () => {
    const user = UserFactory.createNewUser({});
    user.id = 1;

    const users = new Users([user]);
    const paginated = new PaginatedUsers(users, 10);
    expect(paginated.getUsers().count()).toEqual(1);
    expect(paginated.getUsers().isEmpty()).toBeFalsy();
    expect(paginated.getUsers().allIndexedById()[1].id).toEqual(user.id);
    expect(paginated.getTotal()).toEqual(10);
  });
});
