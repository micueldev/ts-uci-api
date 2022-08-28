import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import UserService from '@/Domain/Service/User/UserService';
import UserCriteria from '@/Domain/Model/User/UserCriteria';
import { LoginProps } from '@/Http/Model/Auth/AuthTransformer';
import UserNotFoundException from '@/Domain/Model/User/UserNotFoundException';
import { validate } from '@/Domain/Helper/passwordHelper';
import BadCredentialsException from '@/Domain/Exception/BadCredentialsException';
import AuthTransformer from '@/Http/Model/Auth/AuthTransformer';
import { generate } from '@/Domain/Helper/jwtHelper';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body }: { body: LoginProps } = req;

    const userService = Container.get(UserService);

    const user = await userService.getUser(
      UserCriteria.createByUsername(body.username),
    );

    if (!(await validate(body.password, user.getPassword()))) {
      throw new UserNotFoundException();
    }

    if (!user.isActive) {
      throw new BadCredentialsException('The user is blocked');
    }

    res.json(AuthTransformer.DefaultLoginOutput(user, generate(user.id!)));
  } catch (err) {
    if (err instanceof UserNotFoundException) {
      next(new BadCredentialsException('Username or password incorrect'));
    }
    next(err);
  }
};

export { login };
