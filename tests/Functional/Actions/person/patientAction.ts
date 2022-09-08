import { Response } from 'supertest';
import { Application } from 'express';

import PersonFactory from '~/Domain/Model/Person/PersonFactory';
import {
  requestApiV1,
  GET,
  POST,
  PUT,
  DELETE,
  QueryParamProps,
  getQuery,
} from '~/Functional/Actions/baseAction';

import Patient from '@/Domain/Model/Person/Patient';
import PersonRepository from '@/DB/Model/Person/PersonRepository';

export const createPatientModel = async (
  personRepository: PersonRepository,
  {
    firstName = 'Juan',
    lastName = 'Perez',
    birthDate = new Date('2022-02-26'),
    documentNumber = '87654321',
    accountNumber = '12341234',
    weight = 20.5,
    startInstitute = new Date('2022-07-28'),
    startUci = new Date('2022-08-05'),
  }: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    documentNumber?: string;
    accountNumber?: string;
    weight?: number;
    startInstitute?: Date;
    startUci?: Date;
  },
): Promise<Patient> => {
  const patient = PersonFactory.createNewPatient({
    firstName,
    lastName,
    birthDate,
    documentNumber,
    accountNumber,
    weight,
    startInstitute,
    startUci,
  });

  await personRepository.createPerson(patient);

  return patient;
};

export const getPatients = (
  app: Application,
  params: Array<QueryParamProps> = [],
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    GET,
    `/person/patients/?${getQuery(params)}`,
    null,
    authResponse,
  );
};

export const getPatient = (
  app: Application,
  id: number,
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(app, GET, `/person/patients/${id}`, null, authResponse);
};

export const createPatient = (
  app: Application,
  {
    firstName = 'Juan',
    lastName = 'Perez',
    birthDate = '2022-02-26',
    documentNumber = '87654321',
    accountNumber = '12341234',
    weight = 20.5,
    startInstitute = '2022-07-28',
    startUci = '2022-08-05',
  }: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    documentNumber?: string;
    accountNumber?: string;
    weight?: number;
    startInstitute?: string;
    startUci?: string;
  },
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    POST,
    '/person/patients/',
    {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      document_number: documentNumber,
      account_number: accountNumber,
      weight: weight,
      start_institute: startInstitute,
      start_uci: startUci,
    },
    authResponse,
  );
};

export const updatePatient = (
  app: Application,
  id: number,
  {
    firstName = 'Luis',
    lastName = 'Gomez',
    birthDate = '2021-11-11',
    documentNumber = '12123434',
    accountNumber = '654123',
    weight = 20.5,
    startInstitute = '2022-07-31',
    startUci = '2022-08-03',
  }: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    documentNumber?: string;
    accountNumber?: string;
    weight?: number;
    startInstitute?: string;
    startUci?: string;
  },
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    PUT,
    `/person/patients/${id}`,
    {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      document_number: documentNumber,
      account_number: accountNumber,
      weight,
      start_institute: startInstitute,
      start_uci: startUci,
    },
    authResponse,
  );
};

export const deletePatient = (
  app: Application,
  id: number,
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    DELETE,
    `/person/patients/${id}`,
    null,
    authResponse,
  );
};
