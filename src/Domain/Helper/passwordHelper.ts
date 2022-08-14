import { genSalt, hash, compare } from 'bcrypt';

const encrypt = async (data: string) => {
    const salt = await genSalt();
    return hash( data, salt );
}

const validate = async  (data: string, encrypted: string) => {
    return compare( data, encrypted );
}

export {
    encrypt,
    validate
}