import 'reflect-metadata';
import { Service, Inject } from 'typedi';

import UserRepository from '@/DB/Model/User/UserRepository';
import User from '@/Domain/Model/User/User';
import UserCriteria from '@/Domain/Model/User/UserCriteria';
import PaginatedUsers from '@/Domain/Model/User/PaginatedUsers';
import BadRequestException from '@/Domain/Exception/BadRequestException';
import { encrypt } from '@/Domain/Helper/passwordHelper';
import UserNotFoundException from '@/Domain/Model/User/UserNotFoundException';

@Service()
class UserService {
  @Inject()
  userRepository!: UserRepository;

  public async getUsers(userCriteria: UserCriteria): Promise<PaginatedUsers> {
    const users = await this.userRepository.findUsersBy(userCriteria);
    const count = await this.userRepository.countUsers(userCriteria);

    return new PaginatedUsers(users, count);
  }

  public async getUser(userCriteria: UserCriteria): Promise<User> {
    return this.userRepository.findOneUserBy(userCriteria);
  }

  public async createUser(user: User): Promise<User> {
    try {
      const existUsername = await this.userRepository.findOneUserBy(
        UserCriteria.createByUsername(user.username),
      );
      if (existUsername) {
        throw new BadRequestException('Username already exists');
      }
    } catch (err) {
      if (err instanceof UserNotFoundException == false) {
        throw err;
      }
    }

    try {
      const existEmail = await this.userRepository.findOneUserBy(
        UserCriteria.createByEmail(user.email),
      );
      if (existEmail) {
        throw new BadRequestException('Email already exists');
      }
    } catch (err) {
      if (err instanceof UserNotFoundException == false) {
        throw err;
      }
    }

    user.setPassword(await encrypt(user.getPassword()));

    await this.userRepository.createUser(user);

    return user;
  }

  public async updateUser(user: User): Promise<User> {
    try {
      const existUsername = await this.userRepository.findOneUserBy(
        UserCriteria.createByUsername(user.username),
      );
      if (existUsername && existUsername.id != user.id) {
        throw new BadRequestException('Username already exists');
      }
    } catch (err) {
      if (err instanceof UserNotFoundException == false) {
        throw err;
      }
    }

    try {
      const existEmail = await this.userRepository.findOneUserBy(
        UserCriteria.createByEmail(user.email),
      );
      if (existEmail && existEmail.id != user.id) {
        throw new BadRequestException('Email already exists');
      }
    } catch (err) {
      if (err instanceof UserNotFoundException == false) {
        throw err;
      }
    }

    const userSaved = await this.userRepository.findOneUserBy(
      UserCriteria.createById(user.id!),
    );
    userSaved.username = user.username;
    userSaved.firstName = user.firstName;
    userSaved.lastName = user.lastName;
    userSaved.email = user.email;

    await this.userRepository.updateUser(userSaved, [
      'username',
      'firstName',
      'lastName',
      'email',
    ]);

    return userSaved;
  }
}

export default UserService;
