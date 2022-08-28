import { generate, validate } from '@/Domain/Helper/jwtHelper';

describe('Test jwt helper', () => {
  it('generate jwt', () => {
    const id = 10;
    const token = generate(id);
    expect(typeof token).toEqual('string');
    expect(token.split('.').length).toEqual(3);
  });

  it('validate correct jwt', () => {
    const id = 25;
    const token = generate(id);

    const tokenData = validate(token);
    expect(typeof tokenData).toEqual('object');
    expect(tokenData.id).toEqual(id);
  });

  it('validate incorrect jwt', () => {
    let responseType = null;
    let responseClassName = null;

    try {
      validate('123456');
    } catch (err) {
      responseType = typeof err;
      if (typeof err === 'object') {
        responseClassName = Object.getPrototypeOf(err).constructor.name;
      }
    }

    expect(responseType).toEqual('object');
    expect(responseClassName).toEqual('JsonWebTokenError');
  });
});
