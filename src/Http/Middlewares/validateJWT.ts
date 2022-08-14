import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import BadCredentialsException from '../../Domain/Exception/BadCredentialsException';
import { validate } from '../../Domain/Helper/jwtHelper';
import UserService from '../../Domain/Service/User/UserService';
import UserCriteria from '../../Domain/Model/User/UserCriteria';

const validateJWT = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        let token = req.header('Authorization');
        if ( !token ) {
            throw new BadCredentialsException('The token is missing');
        }
        
        token = token.replace(/^Bearer\s/, '');
        
        const { id: userId } = validate( token! );
        
        const userService = Container.get(UserService);

        const user = await userService.getUser(UserCriteria.createById(userId));

        if(!user.isActive){
            throw new BadCredentialsException('The user is blocked');
        }
        
        req.currentUser = user;

    } catch (err) {
        if(err instanceof BadCredentialsException == false){
            err = new BadCredentialsException('Token invalid')
        }
        next(err);
    }

    next();
};


export default validateJWT
