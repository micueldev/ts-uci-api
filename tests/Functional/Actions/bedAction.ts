import { Response } from 'supertest';
import { Application } from 'express';

import BedFactory from '~/Domain/Model/Bed/BedFactory';
import {
  requestApiV1,
  GET,
  POST,
  PUT,
  DELETE,
  QueryParamProps,
  getQuery,
} from '~/Functional/Actions/baseAction';

import Bed from '@/Domain/Model/Bed/Bed';
import BedRepository from '@/DB/Model/Bed/BedRepository';

export const createBedModel = async (
  bedRepository: BedRepository,
  {
    name = 'bed',
    description = 'description',
  }: {
    name?: string;
    description?: string | null;
  },
): Promise<Bed> => {
  const bed = BedFactory.createNewBed({
    name,
    description,
  });

  await bedRepository.createBed(bed);

  return bed;
};

export const getBeds = (
  app: Application,
  params: Array<QueryParamProps> = [],
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    GET,
    `/beds/?${getQuery(params)}`,
    null,
    authResponse,
  );
};

export const getBed = (
  app: Application,
  id: number,
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(app, GET, `/beds/${id}`, null, authResponse);
};

export const createBed = (
  app: Application,
  {
    name = 'bed',
    description = 'description',
  }: {
    name?: string;
    description?: string | null;
  },
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    POST,
    '/beds/',
    {
      name,
      description,
    },
    authResponse,
  );
};

export const updateBed = (
  app: Application,
  id: number,
  {
    name = 'bed',
    description = 'description',
  }: {
    name?: string;
    description?: string | null;
  },
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(
    app,
    PUT,
    `/beds/${id}`,
    {
      name,
      description,
    },
    authResponse,
  );
};

export const deleteBed = (
  app: Application,
  id: number,
  authResponse: Response | null = null,
): Promise<Response> => {
  return requestApiV1(app, DELETE, `/beds/${id}`, null, authResponse);
};
