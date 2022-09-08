import Validator from '@/Http/Model/Validator';

describe('Test Validator', () => {
  it('Test isStringNumeric valid', async () => {
    const stringNumeric = '01234567890';
    const field = 'field';
    expect(Validator.isStringNumeric(stringNumeric, { field })).toBeTruthy();
  });

  it('Test isStringNumeric invalid', async () => {
    const stringNumeric = '0l234567890';
    const field = 'field';

    let errorMessage = null;
    try {
      Validator.isStringNumeric(stringNumeric, { field });
      throw new Error('Bad test');
    } catch (err) {
      if (err instanceof Error) {
        errorMessage = err.message;
      }
    }
    expect(errorMessage).toEqual(`The ${field} is invalid`);
  });
});
