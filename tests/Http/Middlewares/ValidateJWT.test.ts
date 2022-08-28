import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import UserFactory from '~/Domain/Model/User/UserFactory';

import UserRepository from '@/DB/Model/User/UserRepository';
import BadCredentialsException from '@/Domain/Exception/BadCredentialsException';
import { generate } from '@/Domain/Helper/jwtHelper';
import validateJWT from '@/Http/Middlewares/validateJWT';

describe('Validate JWT middleware', () => {
  let mockRequest: Partial<Request>;
  const mockResponse: Partial<Response> = {};
  let nextFunction: NextFunction;

  beforeEach(() => {
    nextFunction = jest.fn();
    Container.remove(UserRepository);
  });

  test('Valid JWT', async () => {
    const user = UserFactory.createRandomUser();

    const mockUserRepository: Partial<UserRepository> = {
      findOneUserBy: jest.fn().mockResolvedValue(user),
    };
    Container.set(UserRepository, mockUserRepository);

    mockRequest = {
      header: jest.fn().mockReturnValue(`Bearer ${generate(user.id!)}`),
    };

    await validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.header).toBeCalledTimes(1);
    expect(nextFunction).toBeCalledTimes(1);
  });

  test('Invalid JWT due to user blocked', async () => {
    const user = UserFactory.createRandomUser();
    user.isActive = false;

    const mockUserRepository: Partial<UserRepository> = {
      findOneUserBy: jest.fn().mockResolvedValue(user),
    };
    Container.set(UserRepository, mockUserRepository);

    mockRequest = {
      header: jest.fn().mockReturnValue(`Bearer ${generate(user.id!)}`),
    };

    await validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.header).toBeCalledTimes(1);
    expect(nextFunction).toBeCalledTimes(2);
    expect(nextFunction).toBeCalledWith(
      new BadCredentialsException('The user is blocked'),
    );
  });

  test('Invalid JWT due to unknow error', async () => {
    const user = UserFactory.createRandomUser();

    mockRequest = {
      header: jest.fn().mockReturnValue(`Bearer ${generate(user.id!)}`),
    };

    await validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.header).toBeCalledTimes(1);
    expect(nextFunction).toBeCalledTimes(3);
    expect(nextFunction).toBeCalledWith(
      new BadCredentialsException('Token invalid'),
    );
  });
});
