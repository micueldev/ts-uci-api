import { Request, Response, NextFunction } from 'express';

import ViolatedFieldsException from '../Exception/ViolatedFieldsException';
import ObjectNotFoundException from '../../Domain/Exception/ObjectNotFoundException';
import BadRequestException from '../../Domain/Exception/BadRequestException';
import BadCredentialsException from '../../Domain/Exception/BadCredentialsException';


const handleError = (
  err: TypeError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if (
        err instanceof ViolatedFieldsException ||
        err instanceof BadCredentialsException ||
        err instanceof ObjectNotFoundException ||
        err instanceof BadRequestException
    ) {
        let response: any = {
            message: err.getMessage()
        };

        if(err instanceof ViolatedFieldsException){
            response.errors = err.getViolatedFields();
        }

        res.status(err.getStatus()).json(response)
    } else {
        res.status(500).json({
            message: 'Unknown error' 
        });
    }    
};


export default handleError
