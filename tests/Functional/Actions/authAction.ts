import { Response } from 'supertest';
import { Application } from 'express';

import { requestApiV1, POST } from '~/Functional/Actions/baseAction';
import UserFactory from '~/Domain/Model/User/UserFactory';

import User from '@/Domain/Model/User/User';
import UserRepository from '@/DB/Model/User/UserRepository';
import { encrypt } from '@/Domain/Helper/passwordHelper';

export const createUserModel = async (
  userRepository: UserRepository,
  {
    username = 'user',
    firstName = 'Name',
    lastName = 'Last Name',
    email = 'user@email.com',
    password = '123456',
    isActive = true,
  }: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
  },
): Promise<User> => {
  const user = UserFactory.createNewUser({
    username,
    firstName,
    lastName,
    email,
    password: await encrypt(password),
    isActive,
  });

  await userRepository.createUser(user);

  return user;
};

export const login = (
  app: Application,
  {
    username = 'user',
    password = '123456',
  }: {
    username?: string;
    password?: string;
  },
): Promise<Response> => {
  return requestApiV1(app, POST, '/auth/login', { username, password });
};

export const loginAs = async (
  app: Application,
  userRepository: UserRepository,
): Promise<Response> => {
  await createUserModel(userRepository, {
    username: 'administrator',
    email: 'administrator@email.com',
  });
  return login(app, { username: 'administrator', password: '123456' });
};
