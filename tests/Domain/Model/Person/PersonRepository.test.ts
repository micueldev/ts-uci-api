import PersonFactory from '~/Domain/Model/Person/PersonFactory';

import PersonRepository from '@/DB/Model/Person/PersonRepository';
import PatientModel from '@/DB/Model/Person/PatientModel';
import TechnicalModel from '@/DB/Model/Person/TechnicalModel';
import PersonModel from '@/DB/Model/Person/PersonModel';
import Patient from '@/Domain/Model/Person/Patient';
import Person from '@/Domain/Model/Person/Person';
import Technical from '@/Domain/Model/Person/Technical';
import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import PersonNotFoundException from '@/Domain/Model/Person/PersonNotFoundException';

let personRepository: PersonRepository;

beforeAll(async () => {
  personRepository = new PersonRepository();
});

describe('Test PersonRepository', () => {
  beforeEach(async () => {
    await PatientModel.sync();
    await TechnicalModel.sync();
    await PersonModel.sync();
  });

  afterEach(async () => {
    await PatientModel.drop();
    await TechnicalModel.drop();
    await PersonModel.drop();
  });

  it('test get not found', async () => {
    try {
      await personRepository.findOnePersonBy(PersonCriteria.createById(1));
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new PersonNotFoundException());
    }
  });

  it('test create patient person', async () => {
    const patient = PersonFactory.createNewPatient({});
    expect(patient.id).toBeNull();

    await personRepository.createPerson(patient);

    const patientCreated = (await personRepository.findOnePersonBy(
      PersonCriteria.createById(patient.id!).filterByType(Person.TYPE_PATIENT),
    )) as Patient;

    expect(patientCreated.id).not.toBeNull();
    expect(patientCreated.id).toEqual(patient.id);
    expect(patientCreated.firstName).toEqual(patient.firstName);
    expect(patientCreated.lastName).toEqual(patient.lastName);
    expect(patientCreated.birthDate?.toISOString().slice(0, 10)).toEqual(
      patient.birthDate?.toISOString().slice(0, 10),
    );
    expect(patientCreated.documentNumber).toEqual(patient.documentNumber);
    expect(patientCreated.accountNumber).toEqual(patient.accountNumber);
    expect(patientCreated.weight).toEqual(patient.weight);
    expect(patientCreated.startInstitute.toISOString().slice(0, 10)).toEqual(
      patient.startInstitute.toISOString().slice(0, 10),
    );
    expect(patientCreated.startUci.toISOString().slice(0, 10)).toEqual(
      patient.startUci.toISOString().slice(0, 10),
    );
  });

  it('test create technical person', async () => {
    const technical = PersonFactory.createNewTechnical({});
    expect(technical.id).toBeNull();

    await personRepository.createPerson(technical);

    const technicalCreated = await personRepository.findOnePersonBy(
      PersonCriteria.createById(technical.id!).filterByType(
        Person.TYPE_TECHNICAL,
      ),
    );

    expect(technicalCreated.id).not.toBeNull();
    expect(technicalCreated.id).toEqual(technical.id);
    expect(technicalCreated.firstName).toEqual(technical.firstName);
    expect(technicalCreated.lastName).toEqual(technical.lastName);
    expect(technicalCreated.birthDate).toBeNull();
    expect(technicalCreated.documentNumber).toBeNull();
  });

  it('test update patient person', async () => {
    const patient = (await createAndGetPerson(
      personRepository,
      Person.TYPE_PATIENT,
    )) as Patient;

    const firstName = (patient.firstName = 'First');
    const lastName = (patient.lastName = 'Last');
    const birthDate = (patient.birthDate = new Date('2022-02-03'));
    const documentNumber = (patient.documentNumber = '43214321');
    const accountNumber = (patient.accountNumber = '12123434');
    const weight = (patient.weight = 26.7);
    const startInstitute = (patient.startInstitute = new Date('2022-04-19'));
    const startUci = (patient.startUci = new Date('2022-05-06'));

    await personRepository.updatePerson(patient);
    const patientUpdated = (await personRepository.findOnePersonBy(
      PersonCriteria.createById(patient.id!).filterByType(Person.TYPE_PATIENT),
    )) as Patient;

    expect(patientUpdated.firstName).toEqual(firstName);
    expect(patientUpdated.lastName).toEqual(lastName);
    expect(patientUpdated.birthDate?.toISOString().slice(0, 10)).toEqual(
      birthDate?.toISOString().slice(0, 10),
    );
    expect(patientUpdated.documentNumber).toEqual(documentNumber);
    expect(patientUpdated.accountNumber).toEqual(accountNumber);
    expect(patientUpdated.weight).toEqual(weight);
    expect(patientUpdated.startInstitute.toISOString().slice(0, 10)).toEqual(
      startInstitute.toISOString().slice(0, 10),
    );
    expect(patientUpdated.startUci.toISOString().slice(0, 10)).toEqual(
      startUci.toISOString().slice(0, 10),
    );
  });

  it('test update technical person', async () => {
    const patient = (await createAndGetPerson(
      personRepository,
      Person.TYPE_TECHNICAL,
    )) as Technical;

    const firstName = (patient.firstName = 'First');
    const lastName = (patient.lastName = 'Last');
    const birthDate = (patient.birthDate = new Date('2022-02-03'));
    const documentNumber = (patient.documentNumber = '43214321');

    await personRepository.updatePerson(patient);
    const technicalUpdated = (await personRepository.findOnePersonBy(
      PersonCriteria.createById(patient.id!).filterByType(
        Person.TYPE_TECHNICAL,
      ),
    )) as Patient;

    expect(technicalUpdated.firstName).toEqual(firstName);
    expect(technicalUpdated.lastName).toEqual(lastName);
    expect(technicalUpdated.birthDate?.toISOString().slice(0, 10)).toEqual(
      birthDate?.toISOString().slice(0, 10),
    );
    expect(technicalUpdated.documentNumber).toEqual(documentNumber);
  });

  it('test update not found', async () => {
    try {
      const person = PersonFactory.createRandomPerson();
      person.id = 1;
      await personRepository.updatePerson(person);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new PersonNotFoundException());
    }
  });

  it('test delete patient person', async () => {
    const patient = await createAndGetPerson(
      personRepository,
      Person.TYPE_PATIENT,
    );

    await personRepository.deletePersonById(patient.id!, Person.TYPE_PATIENT);

    try {
      await personRepository.findOnePersonBy(
        PersonCriteria.createById(patient.id!),
      );
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new PersonNotFoundException());
    }
  });

  it('test delete technical person', async () => {
    const technical = await createAndGetPerson(
      personRepository,
      Person.TYPE_TECHNICAL,
    );

    await personRepository.deletePersonById(
      technical.id!,
      Person.TYPE_TECHNICAL,
    );

    try {
      await personRepository.findOnePersonBy(
        PersonCriteria.createById(technical.id!),
      );
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new PersonNotFoundException());
    }
  });

  it('test double delete person', async () => {
    const person = await createAndGetPerson(
      personRepository,
      Person.TYPE_PATIENT,
    );

    await personRepository.deletePersonById(person.id!, Person.TYPE_PATIENT);

    try {
      await personRepository.deletePersonById(person.id!, Person.TYPE_PATIENT);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new PersonNotFoundException());
    }
  });

  it('test delete not found', async () => {
    try {
      await personRepository.deletePersonById(1234, Person.TYPE_PATIENT);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new PersonNotFoundException());
    }
  });

  it('test count persons', async () => {
    const patientPerson = await createAndGetPerson(
      personRepository,
      Person.TYPE_PATIENT,
    );
    const technicalPerson = await createAndGetPerson(
      personRepository,
      Person.TYPE_TECHNICAL,
    );

    let persons = await personRepository.findPersonsBy(
      PersonCriteria.createById(patientPerson.id!),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByIds([patientPerson.id!, technicalPerson.id!]),
    );
    expect(persons.count()).toEqual(2);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByIds([technicalPerson.id!]),
    );
    expect(persons.count()).toEqual(1);
  });

  it('test filter persons', async () => {
    const patientPerson = await createAndGetPerson(
      personRepository,
      Person.TYPE_PATIENT,
    );

    const technicalPerson = await createAndGetPerson(
      personRepository,
      Person.TYPE_TECHNICAL,
    );

    let persons = await personRepository.findPersonsBy(
      PersonCriteria.createByIds([patientPerson.id!, technicalPerson.id!]),
    );
    expect(persons.count()).toEqual(2);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByIds([technicalPerson.id!]),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByType(Person.TYPE_PATIENT),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByType(Person.TYPE_TECHNICAL),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByDocumentNumber(patientPerson.documentNumber!),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByName(patientPerson.firstName),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByName(patientPerson.lastName),
    );
    expect(persons.count()).toEqual(1);

    persons = await personRepository.findPersonsBy(
      PersonCriteria.createByDocumentNumber('888888888'),
    );
    expect(persons.count()).toEqual(0);
  });
});

const createPerson = async (
  personRepository: PersonRepository,
  type: string,
): Promise<Person> => {
  let person: Person;
  if (type === Person.TYPE_PATIENT) {
    person = PersonFactory.createNewPatient({});
  } else {
    person = PersonFactory.createNewTechnical({});
  }
  await personRepository.createPerson(person);
  return person;
};

const createAndGetPerson = async (
  personRepository: PersonRepository,
  type: string = Person.TYPE_PATIENT,
): Promise<Person> => {
  const person = await createPerson(personRepository, type);
  return personRepository.findOnePersonBy(
    PersonCriteria.createById(person.id!),
  );
};
