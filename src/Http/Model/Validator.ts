class Validator {
  public static isStringNumeric(
    string: string,
    {
      field,
    }: {
      field: string;
    },
  ): boolean {
    const stringFormated = string.replace(/\D/, '');
    if (stringFormated !== string) {
      throw new Error(`The ${field} is invalid`);
    }

    return true;
  }
}

export default Validator;
