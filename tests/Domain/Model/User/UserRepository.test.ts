import UserFactory from '~/Domain/Model/User/UserFactory';

import UserRepository from '@/DB/Model/User/UserRepository';
import UserModel from '@/DB/Model/User/UserModel';
import User from '@/Domain/Model/User/User';
import UserCriteria from '@/Domain/Model/User/UserCriteria';
import UserNotFoundException from '@/Domain/Model/User/UserNotFoundException';

let userRepository: UserRepository;

beforeAll(async () => {
  userRepository = new UserRepository();
});

describe('Test UserRepository', () => {
  beforeEach(async () => {
    await UserModel.sync();
  });

  afterEach(async () => {
    await UserModel.drop();
  });

  it('test get not found', async () => {
    try {
      await userRepository.findOneUserBy(UserCriteria.createById(1));
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new UserNotFoundException());
    }
  });

  it('test create user', async () => {
    const user = UserFactory.createNewUser({});
    expect(user.id).toBeNull();

    await userRepository.createUser(user);

    const userCreated = await userRepository.findOneUserBy(
      UserCriteria.createById(user.id!),
    );

    expect(userCreated.id).not.toBeNull();
    expect(userCreated.id).toEqual(user.id);
    expect(userCreated.username).toEqual(user.username);
    expect(userCreated.firstName).toEqual(user.firstName);
    expect(userCreated.lastName).toEqual(user.lastName);
    expect(userCreated.email).toEqual(user.email);
    expect(userCreated.getPassword()).toEqual(user.getPassword());
    expect(userCreated.isActive).toEqual(user.isActive);
  });

  it('test update user', async () => {
    const user = await createAndGetUser(userRepository);

    const username = (user.username = 'admin');
    const firstName = (user.firstName = 'name2');
    const lastName = (user.lastName = 'lastname2');
    const email = (user.email = 'admin');
    const isActive = (user.isActive = false);

    await userRepository.updateUser(user);
    const userUpdated = await userRepository.findOneUserBy(
      UserCriteria.createById(user.id!),
    );

    expect(userUpdated.username).toEqual(username);
    expect(userUpdated.firstName).toEqual(firstName);
    expect(userUpdated.lastName).toEqual(lastName);
    expect(userUpdated.email).toEqual(email);
    expect(userUpdated.isActive).toEqual(isActive);
  });

  it('test update not found', async () => {
    try {
      const user = UserFactory.createNewUser({});
      user.id = 1;
      await userRepository.updateUser(user);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new UserNotFoundException());
    }
  });

  it('test count users', async () => {
    const user = await createAndGetUser(userRepository);

    const user2 = UserFactory.createNewUser({
      username: 'admin',
      firstName: 'nombre2',
      lastName: 'apellido2',
      email: 'admin@email.com',
      isActive: false,
    });
    await userRepository.createUser(user2);

    let users = await userRepository.findUsersBy(
      UserCriteria.createById(user.id!),
    );
    expect(users.count()).toEqual(1);

    users = await userRepository.findUsersBy(
      UserCriteria.createByIds([user.id!, user2.id!]),
    );
    expect(users.count()).toEqual(2);

    users = await userRepository.findUsersBy(
      UserCriteria.createByIds([user2.id!]),
    );
    expect(users.count()).toEqual(1);
  });

  it('test filter users', async () => {
    const user = await createAndGetUser(userRepository);

    const user2 = UserFactory.createNewUser({
      username: 'admin',
      firstName: 'nombre2',
      lastName: 'apellido2',
      email: 'admin@email.com',
      isActive: false,
    });
    await userRepository.createUser(user2);

    let users = await userRepository.findUsersBy(
      UserCriteria.createByIds([user.id!, user2.id!]),
    );
    expect(users.count()).toEqual(2);

    users = await userRepository.findUsersBy(
      UserCriteria.createByIds([user2.id!]),
    );
    expect(users.count()).toEqual(1);

    users = await userRepository.findUsersBy(
      UserCriteria.createByUsername(user2.username),
    );
    expect(users.count()).toEqual(1);

    users = await userRepository.findUsersBy(
      UserCriteria.createByEmail(user2.email),
    );
    expect(users.count()).toEqual(1);
  });
});

const createUser = async (userRepository: UserRepository): Promise<User> => {
  const user = UserFactory.createNewUser({});
  await userRepository.createUser(user);
  return user;
};

const createAndGetUser = async (
  userRepository: UserRepository,
): Promise<User> => {
  const user = await createUser(userRepository);
  return userRepository.findOneUserBy(UserCriteria.createById(user.id!));
};
