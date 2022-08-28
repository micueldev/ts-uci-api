import { Response } from 'supertest';
import { Application } from 'express';

import {
  requestApiV1,
  GET,
  POST,
  PUT,
  QueryParamProps,
  getQuery,
} from '~/Functional/Actions/baseAction';

export const getUsers = (
  app: Application,
  params: Array<QueryParamProps> = [],
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    GET,
    `/users/?${getQuery(params)}`,
    null,
    authResponse,
  );
};

export const getUser = (
  app: Application,
  id: number,
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(app, GET, `/users/${id}`, null, authResponse);
};

export const createUser = (
  app: Application,
  {
    username = 'user',
    firstName = 'Name',
    lastName = 'Last Name',
    email = 'user@email.com',
    password = '123456',
  }: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  },
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    POST,
    '/users/',
    {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    },
    authResponse,
  );
};

export const updateUser = (
  app: Application,
  id: number,
  {
    username = 'user',
    firstName = 'Name',
    lastName = 'Last Name',
    email = 'user@email.com',
  }: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  },
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    PUT,
    `/users/${id}`,
    {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
    },
    authResponse,
  );
};
