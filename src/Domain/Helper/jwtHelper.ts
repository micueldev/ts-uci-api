import { sign, verify } from 'jsonwebtoken';

import { jwt } from '../../Server/Configs/enviroment';


const generate = (id: number): string => sign( {id}, jwt.secret );

const validate = (jwtSigned: string): any => verify( jwtSigned, jwt.secret);


export {
    generate,
    validate
}
