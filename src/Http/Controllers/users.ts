import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { Container } from 'typedi';

import UserService from '@/Domain/Service/User/UserService';
import UserCriteria from '@/Domain/Model/User/UserCriteria';
import UserTransformer, {
  PostUserProps,
  PutUserProps,
} from '@/Http/Model/User/UserTransformer';
import UserCriteriaTransformer from '@/Http/Model/User/UserCriteriaTransformer';
import PaginatedUsersOutput from '@/Http/Model/User/PaginatedUsersOutput';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCriteria = UserCriteriaTransformer.createCriteriaFromQuery(
      req.query,
    );

    const userService = Container.get(UserService);

    const users = await userService.getUsers(userCriteria);

    res.json(new PaginatedUsersOutput(users, userCriteria));
  } catch (err) {
    next(err);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userService = Container.get(UserService);

    const user = await userService.getUser(UserCriteria.createById(+id));

    res.json(UserTransformer.userToDefaultOutput(user));
  } catch (err) {
    next(err);
  }
};

const postUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body }: { body: PostUserProps } = req;

    let user = UserTransformer.postBodyToUser(body);

    const userService = Container.get(UserService);

    user = await userService.createUser(user);

    res.status(HttpStatus.CREATED).json({ id: user.id });
  } catch (err) {
    next(err);
  }
};

const putUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body }: { body: PutUserProps } = req;

    let user = UserTransformer.putBodyToUser(body);
    user.id = +id;

    const userService = Container.get(UserService);

    user = await userService.updateUser(user);

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(err);
  }
};

export { getUsers, getUser, postUser, putUser };
