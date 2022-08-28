export interface ViolatedFieldProps {
  value: any;
  msg: any;
  param: string;
  location: string | undefined;
}

class ViolatedFieldsException extends Error {
  private readonly STATUS = 400;
  private violatedFields: Array<ViolatedFieldProps>;

  public constructor(violatedFields: Array<ViolatedFieldProps>) {
    super();
    this.message = 'Violated Fields Exception';
    this.violatedFields = violatedFields;
  }

  public getStatus(): number {
    return this.STATUS;
  }

  public getMessage(): string {
    return this.message;
  }

  public getViolatedFields(): Array<ViolatedFieldProps> {
    return this.violatedFields;
  }
}

export default ViolatedFieldsException;
