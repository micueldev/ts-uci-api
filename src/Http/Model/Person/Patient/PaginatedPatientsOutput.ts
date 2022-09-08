import PaginatedPersons from '@/Domain/Model/Person/PaginatedPersons';
import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import PaginatedCollectionOutput from '@/Http/Model/PaginatedCollectionOutput';
import PatientTransformer from '@/Http/Model/Person//Patient/PatientTransformer';
import Patient from '@/Domain/Model/Person/Patient';

class PaginatedPatientsOutput extends PaginatedCollectionOutput {
  private paginatedPersons!: PaginatedPersons;

  public constructor(
    paginatedPatients: PaginatedPersons,
    patientCriteria: PersonCriteria,
  ) {
    super(paginatedPatients, patientCriteria);
    this.paginatedPersons = paginatedPatients;
  }

  protected toItems(): Array<any> {
    return this.paginatedPersons
      .getPersons()
      .all()
      .map((person) =>
        PatientTransformer.patientToDefaultOutput(person as Patient),
      );
  }
}

export default PaginatedPatientsOutput;
