import request, { Request, Response } from 'supertest';
import { Application } from 'express';

export interface QueryParamProps {
  key: string;
  value: string;
}

export const getQuery = (params: Array<QueryParamProps>): string => {
  let query = '';
  if (params.length) {
    query = params.reduce(
      (query: string, param: QueryParamProps) =>
        query + `&${param.key}=${param.value}`,
      '',
    );
    query = query.substring(1);
  }
  return query;
};

export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';

export const requestApiV1 = (
  app: Application,
  method: string,
  path: string,
  body: any,
  authResponse: Response | null = null,
): Promise<Response> => {
  const reqApp = request(app);
  const reqPath = `/api/v1${path}`;

  let req: Request;
  if (method === POST) {
    req = reqApp.post(reqPath).send(body);
  } else if (method === PUT) {
    req = reqApp.put(reqPath).send(body);
  } else if (method === DELETE) {
    req = reqApp.delete(reqPath);
  } else {
    req = reqApp.get(reqPath);
  }

  if (authResponse != null) {
    req.set('Authorization', authResponse.body.token);
  }

  return req;
};
