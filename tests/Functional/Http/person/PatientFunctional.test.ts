import { Application } from 'express';

import base from '~/Functional/BaseFunctional';
import PersonFactory from '~/Domain/Model/Person/PersonFactory';

import db from '@/DB/connection';
import Server from '@/Server/Server';
import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import DateFormatter from '@/Http/Model/DateFormatter';
import Person from '@/Domain/Model/Person/Person';
import Patient from '@/Domain/Model/Person/Patient';

let server: Server;
let app: Application;

beforeAll(async () => {
  server = new Server();
  app = server.getApp();
});

describe('Test Functional Patient Person', () => {
  const userRepository = base.userRepository;
  const personRepository = base.personRepository;

  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.drop();
  });

  it('Get patients', async () => {
    await personRepository.createPerson(PersonFactory.createRandomPatient());
    await personRepository.createPerson(PersonFactory.createRandomPatient());

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getPatients(app, [], loginResponse);
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

  it('Get patients with query params', async () => {
    const patient = await base.createPatientModel(personRepository, {
      firstName: 'Miguel',
      documentNumber: '666666',
    });

    const loginResponse = await base.loginAs(app, userRepository);

    const page = 1;
    const limit = 2;
    const documentNumber = `%${patient.documentNumber?.substring(1, 4)}%`;
    const name = patient.firstName.substring(0, 3);

    const query = [
      {
        key: 'document_number',
        value: documentNumber,
      },
      {
        key: 'name',
        value: name,
      },
      { key: 'pagination', value: `${page}:${limit}` },
      { key: 'sorting', value: `id:desc` },
    ];

    const res = await base.getPatients(app, query, loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(Array.isArray(body.items)).toBeTruthy();
    expect(body.items.length).toEqual(1);
    expect(body.page).toEqual(page);
    expect(body.limit).toEqual(limit);
    expect(body.total).toEqual(1);
    expect(body.params.document_number).toEqual(documentNumber);
    expect(body.params.name).toEqual(name);
  });

  it('Get patients not authorized', async () => {
    const res = await base.getPatients(app);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Get patients server error', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const query = [{ key: 'sorting', value: 'asdsadasd:asc' }];

    const res = await base.getPatients(app, query, loginResponse);
    base.expectServerError(res);
    base.expectTypeJson(res);
  });

  it('Get a patient', async () => {
    const patient = PersonFactory.createRandomPatient();
    await personRepository.createPerson(patient);

    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getPatient(app, patient.id!, loginResponse);
    base.expectOk(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(body.id).toEqual(patient.id);
    expect(body.first_name).toEqual(patient.firstName);
    expect(body.last_name).toEqual(patient.lastName);
    expect(body.birth_date).toEqual(
      DateFormatter.format(patient.birthDate!, DateFormatter.HTTP_FORMAT_DATE),
    );
    expect(body.document_number).toEqual(patient.documentNumber);
    expect(body.account_number).toEqual(patient.accountNumber);
    expect(body.weight).toEqual(patient.weight);
    expect(body.start_institute).toEqual(
      DateFormatter.format(
        patient.startInstitute!,
        DateFormatter.HTTP_FORMAT_DATE,
      ),
    );
    expect(body.start_uci).toEqual(
      DateFormatter.format(patient.startUci!, DateFormatter.HTTP_FORMAT_DATE),
    );
    expect(body.created_at).toEqual(body.updated_at);
  });

  it('Get a not existing patient', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.getPatient(app, 99999, loginResponse);
    base.expectNotFound(res);
    base.expectTypeJson(res);
  });

  it('Get a patient not authorized', async () => {
    const res = await base.getPatient(app, 99999);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Create a patient', async () => {
    const patient = PersonFactory.createRandomPatient();

    const loginResponse = await base.loginAs(app, userRepository);
    const res = await base.createPatient(
      app,
      {
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthDate: DateFormatter.format(
          patient.birthDate!,
          DateFormatter.HTTP_FORMAT_DATE,
        ),
        documentNumber: patient.documentNumber!,
        accountNumber: patient.accountNumber,
        weight: patient.weight,
        startInstitute: DateFormatter.format(
          patient.startInstitute!,
          DateFormatter.HTTP_FORMAT_DATE,
        ),
        startUci: DateFormatter.format(
          patient.startUci!,
          DateFormatter.HTTP_FORMAT_DATE,
        ),
      },
      loginResponse,
    );

    base.expectOkCreated(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.id).toEqual('number');

    const resGet = await base.getPatient(app, body.id, loginResponse);
    const bodyGet = resGet.body;
    expect(bodyGet.first_name).toEqual(patient.firstName);
    expect(bodyGet.last_name).toEqual(patient.lastName);
    expect(bodyGet.birth_date).toEqual(
      patient.birthDate?.toISOString().slice(0, 10),
    );
    expect(bodyGet.document_number).toEqual(patient.documentNumber);
    expect(bodyGet.account_number).toEqual(patient.accountNumber);
    expect(bodyGet.weight).toEqual(patient.weight);
    expect(bodyGet.start_institute).toEqual(
      patient.startInstitute.toISOString().slice(0, 10),
    );
    expect(bodyGet.start_uci).toEqual(
      patient.startUci.toISOString().slice(0, 10),
    );
  });

  it('Create a patient not authorized', async () => {
    const res = await base.createPatient(app, {});
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Create a patient failure due to incorrect parameters', async () => {
    const loginResponse = await base.loginAs(app, userRepository);
    const res = await base.createPatient(
      app,
      {
        firstName: '',
        lastName: '',
        birthDate: '',
        documentNumber: '',
        accountNumber: '',
        startInstitute: '',
        startUci: '',
      },
      loginResponse,
    );

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(7);
  });

  it('Create a patient failure due to duplicated documentNumber', async () => {
    const patient = PersonFactory.createRandomPatient();

    const loginResponse = await base.loginAs(app, userRepository);

    await base.createPatient(
      app,
      {
        documentNumber: patient.documentNumber!,
      },
      loginResponse,
    );

    const res = await base.createPatient(
      app,
      {
        documentNumber: patient.documentNumber!,
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');
  });

  it('Update a patient', async () => {
    const patient = await base.createPatientModel(personRepository, {
      firstName: 'Luis',
      lastName: 'Gomez',
      birthDate: new Date('2022-04-05'),
      documentNumber: '12345612',
      accountNumber: '665544',
      weight: 26.7,
      startInstitute: new Date('2022-08-08'),
      startUci: new Date('2022-07-28'),
    });

    const loginResponse = await base.loginAs(app, userRepository);
    const firstName = 'Pablo';
    const lastName = 'Backyardigan';
    const birthDate = '2022-05-04';
    const documentNumber = '12123456';
    const accountNumber = '112233';
    const weight = 27.6;
    const startInstitute = '2022-07-28';
    const startUci = '2022-08-08';

    const res = await base.updatePatient(
      app,
      patient.id!,
      {
        firstName,
        lastName,
        birthDate,
        documentNumber,
        accountNumber,
        weight,
        startInstitute,
        startUci,
      },
      loginResponse,
    );

    base.expectOkNoContent(res);
    base.expectTypeEmpty(res);

    const patientUpdated = (await personRepository.findOnePersonBy(
      PersonCriteria.createById(patient.id!).filterByType(Person.TYPE_PATIENT),
    )) as Patient;

    expect(patientUpdated.id).toEqual(patient.id);
    expect(patientUpdated.firstName).toEqual(firstName);
    expect(patientUpdated.lastName).toEqual(lastName);
    expect(patientUpdated.birthDate?.toISOString().substring(0, 10)).toEqual(
      birthDate,
    );
    expect(patientUpdated.documentNumber).toEqual(documentNumber);
    expect(patientUpdated.accountNumber).toEqual(accountNumber);
    expect(patientUpdated.weight).toEqual(weight);
    expect(
      patientUpdated.startInstitute.toISOString().substring(0, 10),
    ).toEqual(startInstitute);
    expect(patientUpdated.startUci.toISOString().substring(0, 10)).toEqual(
      startUci,
    );
    expect(patientUpdated.updatedAt.getTime()).not.toEqual(
      patientUpdated.createdAt.getTime(),
    );
  });

  it('Update a not existing patient', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updatePatient(app, 43434, {}, loginResponse);
    base.expectNotFound(res);
    base.expectTypeJson(res);
  });

  it('Update a patient not authorized', async () => {
    const res = await base.updatePatient(app, 43434, {});
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });

  it('Update a patient failure due to incorrect parameters', async () => {
    const patient = await base.createPatientModel(personRepository, {
      firstName: 'Luis',
      lastName: 'Gomez',
      birthDate: new Date('2022-04-05'),
      documentNumber: '12345612',
      accountNumber: '665544',
      weight: 26.7,
      startInstitute: new Date('2022-08-08'),
      startUci: new Date('2022-07-28'),
    });
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updatePatient(
      app,
      patient.id!,
      {
        firstName: '',
        lastName: '',
        birthDate: '',
        documentNumber: '',
        accountNumber: '',
        startInstitute: '',
        startUci: '',
      },
      loginResponse,
    );

    base.expectBadRequest(res);
    base.expectTypeJson(res);

    const body = res.body;
    expect(typeof body.message).toEqual('string');
    expect(Array.isArray(body.errors)).toBeTruthy();
    expect(body.errors.length).toEqual(7);
  });

  it('Update a patient failure due to duplicated documentNumber', async () => {
    await base.createPatientModel(personRepository, {
      documentNumber: '12344321',
    });

    const patient = await base.createPatientModel(personRepository, {
      documentNumber: '12341234',
    });
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.updatePatient(
      app,
      patient.id!,
      {
        documentNumber: '12344321',
      },
      loginResponse,
    );
    base.expectBadRequest(res);
    base.expectTypeJson(res);
    expect(typeof res.body.message).toEqual('string');
  });

  it('Delete a patient', async () => {
    const patient = await base.createPatientModel(personRepository, {});

    const loginResponse = await base.loginAs(app, userRepository);

    let res = await base.getPatient(app, patient.id!, loginResponse);
    base.expectOk(res);

    res = await base.deletePatient(app, patient.id!, loginResponse);
    base.expectOkNoContent(res);
    base.expectTypeEmpty(res);

    res = await base.getPatient(app, patient.id!, loginResponse);
    base.expectNotFound(res);
  });

  it('Delete a not existing patient', async () => {
    const loginResponse = await base.loginAs(app, userRepository);

    const res = await base.deletePatient(app, 43434, loginResponse);
    base.expectNotFound(res);
    base.expectTypeJson(res);
  });

  it('Delete a patient not authorized', async () => {
    const res = await base.deletePatient(app, 43434);
    base.expectNotAuthorized(res);
    base.expectTypeJson(res);
  });
});
