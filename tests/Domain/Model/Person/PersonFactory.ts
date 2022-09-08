import Patient from '@/Domain/Model/Person/Patient';
import Person from '@/Domain/Model/Person/Person';
import Technical from '@/Domain/Model/Person/Technical';

class PersonFactory {
  public static createNewPatient({
    firstName = 'Name',
    lastName = 'Patient',
    birthDate = new Date('2022-01-01'),
    documentNumber = '12345678',
    accountNumber = '1234',
    weight = 25,
    startInstitute = new Date('2022-05-21'),
    startUci = new Date('2022-06-02'),
  }: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    documentNumber?: string;
    accountNumber?: string;
    weight?: number;
    startInstitute?: Date;
    startUci?: Date;
  }): Patient {
    const patient = new Patient();
    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.birthDate = birthDate;
    patient.documentNumber = documentNumber;
    patient.accountNumber = accountNumber;
    patient.weight = weight;
    patient.startInstitute = startInstitute;
    patient.startUci = startUci;

    return patient;
  }

  public static createRandomPatient(): Patient {
    const id = Math.ceil(Math.random() * 10000);

    const patient = this.createNewPatient({
      firstName: `First${id}`,
      lastName: `Last${id}`,
      documentNumber: `123${id}`,
    });
    patient.id = id;

    return patient;
  }

  public static createNewTechnical({
    firstName = 'nurse',
    lastName = 'technical',
  }: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date | null;
    documentNumber?: string | null;
  }): Technical {
    const technical = new Technical();
    technical.firstName = firstName;
    technical.lastName = lastName;

    return technical;
  }

  public static createRandomTechnical(): Technical {
    const id = Math.ceil(Math.random() * 10000);

    const technical = this.createNewTechnical({
      firstName: `First${id}`,
      lastName: `Last${id}`,
    });
    technical.id = id;

    return technical;
  }

  public static createRandomPerson(): Person {
    const type = Math.random();

    let person;
    if (type < 0.5) {
      person = this.createRandomPatient();
    } else {
      person = this.createRandomTechnical();
    }

    return person;
  }
}

export default PersonFactory;
