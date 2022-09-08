import { Application } from 'express';

import base from '~/Functional/BaseFunctional';
import UserFactory from '~/Domain/Model/User/UserFactory';

import db from '@/DB/connection';
import Server from '@/Server/Server';
import UserCriteria from '@/Domain/Model/User/UserCriteria';

let server: Server;
let app: Application;

beforeAll(async () => {
  server = new Server();
  app = server.getApp();
});

describe('Test Functional User', () => {
  const userRepository = base.userRepository;

  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.drop();
  });

  it('Get users', async () => {
    await userRepository.createUser(UserFactory.createRandomUser());

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getUsers(app, [], loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(Array.isArray(body.items)).toBeTruthy();
    expect(body.items.length).toEqual(2);
    expect(body.page).toEqual(1);
    expect(body.limit).toEqual(10);
    expect(body.pages).toEqual(1);
    expect(body.total).toEqual(2);
    expect(body.params).toEqual({});
  });

  it('Get users with query params', async () => {
    const user = await base.createUserModel(userRepository, {
      username: 'unknown',
      email: 'unknown@email.com',
    });

    const loginResponse = await base.loginAs(app, userRepository);

    const page = 1;
    const limit = 2;

    const query = [
      { key: 'username', value: user.username },
      { key: 'email', value: user.email },
      { key: 'pagination', value: `${page}:${limit}` },
      { key: 'sorting', value: `id:desc` },
    ];

    const res = await base.getUsers(app, query, loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(Array.isArray(body.items)).toBeTruthy();
    expect(body.items.length).toEqual(1);
    expect(body.page).toEqual(page);
    expect(body.limit).toEqual(limit);
    expect(body.total).toEqual(1);
    expect(body.params.username).toEqual(user.username);
  });

  it('Get users not authorized', async () => {
    const res = await base.getUsers(app);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Get users server error', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const query = [{ key: 'sorting', value: 'asdsadasd:asc' }];

    const res = await base.getUsers(app, query, loginResponse);
    base.expectServerError(res);
    base.expectTypeJson(res);
  });

  it('Get a user', async () => {
    const user = UserFactory.createRandomUser();
    await userRepository.createUser(user);

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getUser(app, user.id!, loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(body.id).toEqual(user.id);
    expect(body.username).toEqual(user.username);
    expect(body.first_name).toEqual(user.firstName);
    expect(body.last_name).toEqual(user.lastName);
    expect(body.email).toEqual(user.email);
    expect(body.created_at).toEqual(body.updated_at);
  });

  it('Get a not existing user', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getUser(app, 99999, loginResponse);
    base.expectNotFound(res);
    base.expectTypeJson(res);
  });

  it('Get a user not authorized', async () => {
    const res = await base.getUser(app, 99999);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Create a user', async () => {
    const user = UserFactory.createRandomUser();

    const loginResponse = await base.loginAs(app, userRepository);
    const res = await base.createUser(
      app,
      {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '654321',
      },
      loginResponse,
    );

    base.expectOkCreated(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.id).toEqual('number');

    const resGet = await base.getUser(app, body.id, loginResponse);
    const bodyGet = resGet.body;
    expect(bodyGet.username).toEqual(user.username);
    expect(bodyGet.first_name).toEqual(user.firstName);
    expect(bodyGet.last_name).toEqual(user.lastName);
    expect(bodyGet.email).toEqual(user.email);
  });

  it('Create a user not authorized', async () => {
    const res = await base.createUser(app, {});
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Create a user failure due to incorrect parameters', async () => {
    const loginResponse = await base.loginAs(app, userRepository);
    const res = await base.createUser(
      app,
      {
        username: 'a',
        firstName: 'b',
        lastName: 'c',
        email: 'email.com',
        password: '123',
      },
      loginResponse,
    );

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(5);
  });

  it('Create a user failure due to duplicated username or email', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    let res = await base.createUser(
      app,
      {
        username: 'administrator',
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');

    res = await base.createUser(
      app,
      {
        email: 'administrator@email.com',
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');
  });

  it('Update a user', async () => {
    const user = await base.createUserModel(userRepository, {
      username: 'unknown',
      email: 'unknown@email.com',
    });

    const loginResponse = await base.loginAs(app, userRepository);
    const username = 'sahoria';
    const firstName = 'Susan';
    const lastName = 'Ahoria';
    const email = 'sahoria@email.com';

    const res = await base.updateUser(
      app,
      user.id!,
      {
        username,
        firstName,
        lastName,
        email,
      },
      loginResponse,
    );

    base.expectOkNoContent(res);
    base.expectTypeEmpty(res);

    const userUpdated = await userRepository.findOneUserBy(
      UserCriteria.createById(user.id!),
    );

    expect(userUpdated.id).toEqual(user.id);
    expect(userUpdated.username).toEqual(username);
    expect(userUpdated.firstName).toEqual(firstName);
    expect(userUpdated.lastName).toEqual(lastName);
    expect(userUpdated.email).toEqual(email);
    expect(userUpdated.updatedAt.getTime()).not.toEqual(
      userUpdated.createdAt.getTime(),
    );
  });

  it('Update a not existing user', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updateUser(app, 43434, {}, loginResponse);
    base.expectNotFound(res);
    base.expectTypeJson(res);
  });

  it('Update a user not authorized', async () => {
    const res = await base.updateUser(app, 43434, {});
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Update a user failure due to incorrect parameters', async () => {
    const user = await base.createUserModel(userRepository, {
      username: 'unknown',
      email: 'unknown@email.com',
    });
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updateUser(
      app,
      user.id!,
      {
        username: 'a',
        firstName: 'b',
        lastName: 'c',
        email: 'email.com',
      },
      loginResponse,
    );

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(4);
  });

  it('Update a user failure due to duplicated username or email', async () => {
    const user = await base.createUserModel(userRepository, {
      username: 'unknown',
      email: 'unknown@email.com',
    });
    const loginResponse = await base.loginAs(app, userRepository);

    let res = await base.updateUser(
      app,
      user.id!,
      {
        username: 'administrator',
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');

    res = await base.updateUser(
      app,
      user.id!,
      {
        email: 'administrator@email.com',
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');
  });
});
