import Collection from '@/Domain/Model/Collection';
import Person from '@/Domain/Model/Person/Person';

class Persons extends Collection {
  private persons: Array<Person>;

  constructor(persons: Array<Person>) {
    super();
    this.persons = persons;
  }

  public all(): Array<Person> {
    return this.persons;
  }
}

export default Persons;
