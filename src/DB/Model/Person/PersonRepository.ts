import 'reflect-metadata';
import { Service } from 'typedi';
import { Op } from 'sequelize';

import PatientModel from '@/DB/Model/Person/PatientModel';
import PersonModel from '@/DB/Model/Person/PersonModel';
import TechnicalModel from '@/DB/Model/Person/TechnicalModel';
import CommonCriteriaBuilder from '@/DB/Model/CommonCriteriaBuilder';
import Patient from '@/Domain/Model/Person/Patient';
import Person, { PersonType } from '@/Domain/Model/Person/Person';
import Technical from '@/Domain/Model/Person/Technical';
import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import IPersonRepository from '@/Domain/Model/Person/IPersonRepository';
import Persons from '@/Domain/Model/Person/Persons';
import PersonNotFoundException from '@/Domain/Model/Person/PersonNotFoundException';

@Service()
class PersonRepository implements IPersonRepository {
  private static readonly TYPE = {
    [Person.TYPE_PATIENT]: 'pat',
    [Person.TYPE_TECHNICAL]: 'tec',
  };

  public async createPerson(person: Person): Promise<void> {
    const now = new Date();
    person.createdAt = now;
    person.updatedAt = now;

    const fields: Array<string> = [
      'firstName',
      'lastName',
      'birthDate',
      'documentNumber',
      'type',
    ];

    const personModel = await PersonModel.create(
      this.PersonToValue(person, fields),
    );
    person.id = personModel.id;

    if (person instanceof Patient) {
      const patientFields: Array<string> = [
        'id',
        'accountNumber',
        'weight',
        'startInstitute',
        'startUci',
      ];
      await PatientModel.create(this.PatientToValue(person, patientFields));
    } else if (person instanceof Technical) {
      const technicalFields: Array<string> = ['id'];
      await TechnicalModel.create(
        this.TechnicalToValue(person, technicalFields),
      );
    }

    person.id = personModel.id;
  }

  public async updatePerson(
    person: Person,
    fields: Array<string> = [
      'firstName',
      'lastName',
      'birthDate',
      'documentNumber',
    ],
  ): Promise<void> {
    const now = new Date();
    person.updatedAt = now;

    fields.push('updatedAt');

    const [affectedRows] = await PersonModel.update(
      this.PersonToValue(person, fields),
      {
        where: {
          id: person.id,
        },
      },
    );
    if (1 !== affectedRows) {
      throw new PersonNotFoundException();
    }

    if (person instanceof Patient) {
      const patientFields: Array<string> = [
        'accountNumber',
        'weight',
        'startInstitute',
        'startUci',
      ];
      await PatientModel.update(this.PatientToValue(person, patientFields), {
        where: {
          id: person.id,
        },
      });
    }
  }

  public async findOnePersonBy(
    personCriteria: PersonCriteria,
  ): Promise<Person> {
    const query = this.applyPersonCriteriaFilters(personCriteria);
    const personModel = await PersonModel.findOne({ ...query });

    if (!personModel) {
      throw new PersonNotFoundException();
    }

    return this.modelToPerson(personModel);
  }

  public async findPersonsBy(personCriteria: PersonCriteria): Promise<Persons> {
    const query = this.applyPersonCriteriaFilters(personCriteria);
    const personModels = await PersonModel.findAll({ ...query });

    return new Persons(
      personModels.map((personModel) => this.modelToPerson(personModel)),
    );
  }

  public async countPersons(personCriteria: PersonCriteria): Promise<number> {
    const query = this.applyPersonCriteriaFilters(personCriteria);
    const count = await PersonModel.count({ ...query });

    return +count;
  }

  public PersonToValue(person: Person, fields: Array<string>): any {
    const personValue: any = {};
    fields.forEach(function (field) {
      if (Object.prototype.hasOwnProperty.call(person, field)) {
        personValue[field] = person[field as keyof Person];

        if (['birthDate'].includes(field)) {
          personValue[field] = personValue[field]?.toISOString().slice(0, 10);
        }
      }
    });

    if (fields.includes('type')) {
      let type;
      if (person instanceof Patient) {
        type = PersonRepository.TYPE[Person.TYPE_PATIENT];
      } else if (person instanceof Technical) {
        type = PersonRepository.TYPE[Person.TYPE_TECHNICAL];
      }
      personValue.type = type;
    }

    return personValue;
  }

  public PatientToValue(patient: Patient, fields: Array<string>): any {
    const patientValue: any = {};
    fields.forEach(function (field) {
      if (Object.prototype.hasOwnProperty.call(patient, field)) {
        patientValue[field] = patient[field as keyof Patient];

        if (['startInstitute', 'startUci'].includes(field)) {
          patientValue[field] = patientValue[field]?.toISOString().slice(0, 10);
        }
      }
    });
    return patientValue;
  }

  public TechnicalToValue(technical: Technical, fields: Array<string>): any {
    const technicalValue: any = {};
    fields.forEach(function (field) {
      if (Object.prototype.hasOwnProperty.call(technical, field)) {
        technicalValue[field] = technical[field as keyof Technical];
      }
    });
    return technicalValue;
  }

  public modelToPerson(personModel: PersonModel): Person {
    let person: Person;
    if (personModel.type === PersonRepository.TYPE[Person.TYPE_TECHNICAL]) {
      person = this.modelToTechnical();
    } else {
      person = this.modelToPatient(personModel);
    }

    person.id = personModel.id;
    person.firstName = personModel.firstName;
    person.lastName = personModel.lastName;
    person.birthDate = personModel.birthDate
      ? new Date(personModel.birthDate)
      : null;
    person.documentNumber = personModel.documentNumber;
    person.createdAt = personModel.createdAt;
    person.updatedAt = personModel.updatedAt;
    person.deletedAt = personModel.deletedAt;
    return person;
  }

  public modelToPatient(personModel: PersonModel): Patient {
    const patientModel = personModel.getDataValue('PatientPerson');

    const patient = new Patient();
    patient.accountNumber = patientModel.accountNumber;
    patient.weight = patientModel.weight;
    patient.startInstitute = new Date(patientModel.startInstitute);
    patient.startUci = new Date(patientModel.startUci);
    return patient;
  }

  public modelToTechnical(): Technical {
    return new Technical();
  }

  private applyPersonCriteriaFilters(personCriteria: PersonCriteria): any {
    const query = CommonCriteriaBuilder.buildCommonCriteria(personCriteria);
    query.where[Op.and].push({ deletedAt: null });

    const type = personCriteria.getType();
    if (type == null) {
      query.include = PatientModel;
    } else if (type === Person.TYPE_TECHNICAL) {
      query.where[Op.and].push({
        type: PersonRepository.TYPE[Person.TYPE_TECHNICAL],
      });
    } else {
      query.include = PatientModel;
      query.where[Op.and].push({
        type: PersonRepository.TYPE[Person.TYPE_PATIENT],
      });
    }

    const documentNumber = personCriteria.getDocumentNumber();
    if (documentNumber) {
      query.where[Op.and].push({
        documentNumber: {
          [Op.like]: documentNumber,
        },
      });
    }

    const name = personCriteria.getName();
    if (name) {
      query.where[Op.and].push({
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${name}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      });
    }

    return query;
  }

  public async deletePersonById(id: number, type: PersonType): Promise<void> {
    const now = new Date();
    const [affectedRows] = await PersonModel.update(
      {
        deletedAt: now,
      },
      {
        where: {
          id,
          deletedAt: null,
          type: PersonRepository.TYPE[type],
        },
      },
    );
    if (1 !== affectedRows) {
      throw new PersonNotFoundException();
    }
  }
}

export default PersonRepository;
