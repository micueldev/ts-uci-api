import { Application } from 'express';

import base from '~/Functional/BaseFunctional';

import db from '@/DB/connection';
import { validate } from '@/Domain/Helper/jwtHelper';
import Server from '@/Server/Server';

let server: Server;
let app: Application;

beforeAll(async () => {
  server = new Server();
  app = server.getApp();
});

describe('Test Functional Auth', () => {
  const userRepository = base.userRepository;

  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.drop();
  });

  it('Login success', async () => {
    const user = await base.createUserModel(userRepository, {});

    const res = await base.login(app, {
      username: 'user',
      password: '123456',
    });

    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;

    expect(body.id).toEqual(user.id);
    expect(body.username).toEqual(user.username);
    expect(body.first_name).toEqual(user.firstName);
    expect(body.last_name).toEqual(user.lastName);
    expect(body.email).toEqual(user.email);

    const { id } = validate(body.token);
    expect(id).toEqual(user.id);
  });

  it('Login failure due to incorrect parameters', async () => {
    const res = await base.login(app, {
      username: '',
      password: '',
    });

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(2);
  });

  it('Login failure due to incorrect password', async () => {
    await base.createUserModel(userRepository, {});

    const res = await base.login(app, {
      username: 'user',
      password: '1234567',
    });

    base.expectNotAuthorized(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
  });

  it('Login failed due to being locked', async () => {
    await base.createUserModel(userRepository, { isActive: false });

    const res = await base.login(app, {
      username: 'user',
      password: '123456',
    });

    base.expectNotAuthorized(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
  });
});
