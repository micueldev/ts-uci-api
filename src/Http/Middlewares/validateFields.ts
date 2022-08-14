import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import ViolatedFieldsException, { ViolatedFieldProps } from '../Exception/ViolatedFieldsException';


const validateFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        const violatedFields: Array<ViolatedFieldProps> = errors.array().map((validationError)=>(
            {
                value: validationError.value,
                msg: validationError.msg,
                param: validationError.param,
                location: validationError.location
            }
            ));
        next(new ViolatedFieldsException(violatedFields));
    }

    next();
};


export default validateFields
