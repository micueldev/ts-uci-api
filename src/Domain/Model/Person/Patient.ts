import Person from '@/Domain/Model/Person/Person';

class Patient extends Person {
  public accountNumber!: string;
  public weight!: number;
  public startInstitute!: Date;
  public startUci!: Date;
}

export default Patient;
