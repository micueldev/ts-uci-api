import BaseModel from '@/Domain/Model/BaseModel';

export type PersonType = 'patient' | 'technical';

abstract class Person extends BaseModel {
  public static readonly TYPE_PATIENT = 'patient';
  public static readonly TYPE_TECHNICAL = 'technical';

  public firstName!: string;
  public lastName!: string;
  public birthDate: Date | null = null;
  public documentNumber: string | null = null;
}

export default Person;
