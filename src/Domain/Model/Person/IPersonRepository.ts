import Person, { PersonType } from '@/Domain/Model/Person/Person';
import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import Persons from '@/Domain/Model/Person/Persons';

interface IPersonRepository {
  createPerson(person: Person): Promise<void>;

  updatePerson(person: Person, fields: Array<string>): Promise<void>;

  findOnePersonBy(personCriteria: PersonCriteria): Promise<Person>;

  findPersonsBy(personCriteria: PersonCriteria): Promise<Persons>;

  countPersons(personCriteria: PersonCriteria): Promise<number>;

  deletePersonById(id: number, type: PersonType): Promise<void>;
}

export default IPersonRepository;
