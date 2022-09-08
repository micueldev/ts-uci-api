import PaginatedCollection from '@/Domain/Model/PaginatedCollection';
import Persons from '@/Domain/Model/Person/Persons';

class PaginatedPersons extends PaginatedCollection {
  private persons!: Persons;

  public constructor(persons: Persons, total: number) {
    super();
    this.persons = persons;
    this.total = total;
  }

  public getPersons(): Persons {
    return this.persons;
  }
}

export default PaginatedPersons;
