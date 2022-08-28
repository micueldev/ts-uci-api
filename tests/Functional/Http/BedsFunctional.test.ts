import { Application } from 'express';

import base from '~/Functional/BaseFunctional';
import BedFactory from '~/Domain/Model/Bed/BedFactory';

import db from '@/DB/connection';
import Server from '@/Server/Server';
import BedCriteria from '@/Domain/Model/Bed/BedCriteria';

let server: Server;
let app: Application;

beforeAll(async () => {
  server = new Server();
  app = server.getApp();
});

describe('Test Functional Bed', () => {
  const userRepository = base.userRepository;
  const bedRepository = base.bedRepository;

  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.drop();
  });

  it('Get beds', async () => {
    await bedRepository.createBed(BedFactory.createRandomBed());
    await bedRepository.createBed(BedFactory.createRandomBed());

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getBeds(app, [], loginResponse);
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

  it('Get beds with query params', async () => {
    const bed = await base.createBedModel(bedRepository, {
      name: 'unknown',
    });

    const loginResponse = await base.loginAs(app, userRepository);

    const page = 1;
    const limit = 2;

    const query = [
      { key: 'name', value: bed.name },
      { key: 'pagination', value: `${page}:${limit}` },
      { key: 'sorting', value: `id:desc` },
    ];

    const res = await base.getBeds(app, query, loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(Array.isArray(body.items)).toBeTruthy();
    expect(body.items.length).toEqual(1);
    expect(body.page).toEqual(page);
    expect(body.limit).toEqual(limit);
    expect(body.total).toEqual(1);
    expect(body.params.name).toEqual(bed.name);
  });

  it('Get beds not authorized', async () => {
    const res = await base.getBeds(app);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Get beds server error', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const query = [{ key: 'sorting', value: 'asdsadasd:asc' }];

    const res = await base.getBeds(app, query, loginResponse);
    base.expectServerError(res);
    base.expectTypeJson(res);
  });

  it('Get a bed', async () => {
    const bed = BedFactory.createRandomBed();
    await bedRepository.createBed(bed);

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getBed(app, loginResponse.body.id, loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(body.id).toEqual(bed.id);
    expect(body.name).toEqual(bed.name);
    expect(body.description).toEqual(bed.description);
    expect(body.created_at).toEqual(body.updated_at);
  });

  it('Get a not existing bed', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getBed(app, 99999, loginResponse);
    base.expectOkNotFound(res);
    base.expectTypeJson(res);
  });

  it('Get a bed not authorized', async () => {
    const res = await base.getBed(app, 99999);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Create a bed', async () => {
    const bed = BedFactory.createRandomBed();

    const loginResponse = await base.loginAs(app, userRepository);
    const res = await base.createBed(
      app,
      {
        name: bed.name,
        description: bed.description,
      },
      loginResponse,
    );

    base.expectOkCreated(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.id).toEqual('number');

    const resGet = await base.getBed(app, body.id, loginResponse);
    const bodyGet = resGet.body;
    expect(bodyGet.name).toEqual(bed.name);
    expect(bodyGet.description).toEqual(bed.description);
  });

  it('Create a bed not authorized', async () => {
    const res = await base.createBed(app, {});
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Create a bed failure due to incorrect parameters', async () => {
    const loginResponse = await base.loginAs(app, userRepository);
    const res = await base.createBed(
      app,
      {
        name: '',
      },
      loginResponse,
    );

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(1);
  });

  it('Create a bed failure due to duplicated name', async () => {
    const bed = BedFactory.createRandomBed();

    const loginResponse = await base.loginAs(app, userRepository);

    await base.createBed(
      app,
      {
        name: bed.name,
      },
      loginResponse,
    );

    const res = await base.createBed(
      app,
      {
        name: bed.name,
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');
  });

  it('Update a bed', async () => {
    const bed = await base.createBedModel(bedRepository, {
      name: 'unknown',
      description: null,
    });

    const loginResponse = await base.loginAs(app, userRepository);
    const name = 'ABC';
    const description = null;

    const res = await base.updateBed(
      app,
      bed.id!,
      {
        name,
        description,
      },
      loginResponse,
    );

    base.expectOkNoContent(res);
    base.expectTypeEmpty(res);

    const bedUpdated = await bedRepository.findOneBedBy(
      BedCriteria.createById(bed.id!),
    );

    expect(bedUpdated.id).toEqual(bed.id);
    expect(bedUpdated.name).toEqual(name);
    expect(bedUpdated.description).toEqual(description);
    expect(bedUpdated.updatedAt.getTime()).not.toEqual(
      bedUpdated.createdAt.getTime(),
    );
  });

  it('Update a not existing bed', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updateBed(app, 43434, {}, loginResponse);
    base.expectOkNotFound(res);
    base.expectTypeJson(res);
  });

  it('Update a bed not authorized', async () => {
    const res = await base.updateBed(app, 43434, {});
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Update a bed failure due to incorrect parameters', async () => {
    const bed = await base.createBedModel(bedRepository, {
      name: 'unknown',
    });
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updateBed(
      app,
      bed.id!,
      {
        name: '',
      },
      loginResponse,
    );

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(1);
  });

  it('Update a bed failure due to duplicated name', async () => {
    await base.createBedModel(bedRepository, {
      name: 'ABC',
    });

    const bed = await base.createBedModel(bedRepository, {
      name: 'unknown',
    });
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updateBed(
      app,
      bed.id!,
      {
        name: 'ABC',
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');
  });

  it('Delete a bed', async () => {
    const bed = await base.createBedModel(bedRepository, {
      name: 'unknown',
      description: null,
    });

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.deleteBed(app, bed.id!, loginResponse);

    base.expectOkNoContent(res);
    base.expectTypeEmpty(res);

    const bedDeleted = await bedRepository.findOneBedBy(
      BedCriteria.createById(bed.id!).addDeleted(true),
    );
    expect(bedDeleted.id).toEqual(bed.id);
    expect(bedDeleted.name).toEqual(bed.name);
    expect(bedDeleted.description).toEqual(bed.description);
  });

  it('Delete a not existing bed', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.deleteBed(app, 43434, loginResponse);
    base.expectOkNotFound(res);
    base.expectTypeJson(res);
  });

  it('Delete a bed not authorized', async () => {
    const res = await base.deleteBed(app, 43434);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });
});
