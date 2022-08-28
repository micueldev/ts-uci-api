import { encrypt, validate } from '@/Domain/Helper/passwordHelper';

describe('Test password helper', () => {
  it('encrypt password', async () => {
    const passwordEncrypted = await encrypt('123456');
    expect(typeof passwordEncrypted).toEqual('string');
    expect(passwordEncrypted.length).toBeGreaterThan(10);
  });

  it('validate correct password', async () => {
    const password = '123456';
    const passwordEncrypted = await encrypt(password);

    const isPasswordValid = await validate(password, passwordEncrypted);
    expect(isPasswordValid).toBeTruthy();
  });

  it('validate incorrect password', async () => {
    const passwordEncrypted = await encrypt('123456');

    const isPasswordValid = await validate('12345', passwordEncrypted);
    expect(isPasswordValid).toBeFalsy();
  });
});
