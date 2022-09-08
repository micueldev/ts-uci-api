import PersonFactory from '~/Domain/Model/Person/PersonFactory';

import Persons from '@/Domain/Model/Person/Persons';
import PaginatedPersons from '@/Domain/Model/Person/PaginatedPersons';

describe('Test Persons', () => {
  it('test new patient person', async () => {
    const person = PersonFactory.createNewPatient({});
    expect(person.firstName).toEqual('Name');
    expect(person.lastName).toEqual('Patient');
    expect(person.birthDate?.toISOString().slice(0, 10)).toEqual('2022-01-01');
    expect(person.documentNumber).toEqual('12345678');
    expect(person.accountNumber).toEqual('1234');
    expect(person.weight).toEqual(25);
    expect(person.startInstitute?.toISOString().slice(0, 10)).toEqual(
      '2022-05-21',
    );
    expect(person.startUci?.toISOString().slice(0, 10)).toEqual('2022-06-02');
  });

  it('test new technical person', async () => {
    const person = PersonFactory.createNewTechnical({});
    expect(person.firstName).toEqual('nurse');
    expect(person.lastName).toEqual('technical');
  });

  it('test with person', async () => {
    const person = PersonFactory.createRandomPerson();

    const persons = new Persons([person]);
    expect(persons.count()).toEqual(1);
    expect(persons.isEmpty()).toBeFalsy();
    expect(persons.allIndexedById()[person.id!].id).toEqual(person.id);
  });

  it('test without person', async () => {
    const persons = new Persons([]);
    expect(persons.count()).toEqual(0);
    expect(persons.isEmpty()).toBeTruthy();
    expect(persons.allIndexedById()).toEqual([]);
  });

  it('test paginated persons', async () => {
    const person1 = PersonFactory.createRandomPatient();
    const person2 = PersonFactory.createRandomTechnical();

    const persons = new Persons([person1, person2]);
    const paginated = new PaginatedPersons(persons, 10);
    expect(paginated.getPersons().count()).toEqual(2);
    expect(paginated.getPersons().isEmpty()).toBeFalsy();
    expect(paginated.getPersons().allIndexedById()[person1.id!].id).toEqual(
      person1.id,
    );
    expect(paginated.getTotal()).toEqual(10);
  });
});
