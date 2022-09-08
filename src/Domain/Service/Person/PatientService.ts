import 'reflect-metadata';
import { Service, Inject } from 'typedi';

import PersonRepository from '@/DB/Model/Person/PersonRepository';
import Patient from '@/Domain/Model/Person/Patient';
import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import PaginatedPatients from '@/Domain/Model/Person/PaginatedPersons';
import BadRequestException from '@/Domain/Exception/BadRequestException';
import PersonNotFoundException from '@/Domain/Model/Person/PersonNotFoundException';
import Person from '@/Domain/Model/Person/Person';

@Service()
class PatientService {
  @Inject()
  personRepository!: PersonRepository;

  public async getPatients(
    patientCriteria: PersonCriteria,
  ): Promise<PaginatedPatients> {
    const patients = await this.personRepository.findPersonsBy(patientCriteria);
    const count = await this.personRepository.countPersons(patientCriteria);

    return new PaginatedPatients(patients, count);
  }

  public async getPatient(personCriteria: PersonCriteria): Promise<Patient> {
    return (await this.personRepository.findOnePersonBy(
      personCriteria,
    )) as Patient;
  }

  public async createPatient(patient: Patient): Promise<Patient> {
    try {
      const existDocumentNumber = await this.personRepository.findOnePersonBy(
        PersonCriteria.createByType(Person.TYPE_PATIENT).filterByDocumentNumber(
          patient.documentNumber!,
        ),
      );
      if (existDocumentNumber) {
        throw new BadRequestException('Document Number already exists');
      }
    } catch (err) {
      if (err instanceof PersonNotFoundException == false) {
        throw err;
      }
    }

    await this.personRepository.createPerson(patient);

    return patient;
  }

  public async updatePatient(patient: Patient): Promise<Patient> {
    try {
      const existDocumentNumber = await this.personRepository.findOnePersonBy(
        PersonCriteria.createByType(Person.TYPE_PATIENT).filterByDocumentNumber(
          patient.documentNumber!,
        ),
      );
      if (existDocumentNumber && existDocumentNumber.id != patient.id) {
        throw new BadRequestException('Document Number already exists');
      }
    } catch (err) {
      if (err instanceof PersonNotFoundException == false) {
        throw err;
      }
    }

    const patientSaved = (await this.personRepository.findOnePersonBy(
      PersonCriteria.createById(patient.id!).filterByType(Person.TYPE_PATIENT),
    )) as Patient;
    patientSaved.firstName = patient.firstName;
    patientSaved.lastName = patient.lastName;
    patientSaved.birthDate = patient.birthDate;
    patientSaved.documentNumber = patient.documentNumber;
    patientSaved.accountNumber = patient.accountNumber;
    patientSaved.weight = patient.weight;
    patientSaved.startInstitute = patient.startInstitute;
    patientSaved.startUci = patient.startUci;

    await this.personRepository.updatePerson(patientSaved, [
      'firstName',
      'lastName',
      'birthDate',
      'documentNumber',
    ]);

    return patientSaved;
  }

  public async deletePatient(id: number): Promise<void> {
    await this.personRepository.deletePersonById(id, Person.TYPE_PATIENT);
  }
}

export default PatientService;
