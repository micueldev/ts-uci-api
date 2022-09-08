import PersonCriteria from '@/Domain/Model/Person/PersonCriteria';
import Person from '@/Domain/Model/Person/Person';
import {
  applySorting,
  applyPagination,
} from '@/Http/Model/CriteriaTransformer';

class PatientCriteriaTransformer {
  public static createCriteriaFromQuery(query: any): PersonCriteria {
    const personCriteria = PersonCriteria.createByType(Person.TYPE_PATIENT);

    if (Object.prototype.hasOwnProperty.call(query, 'document_number')) {
      personCriteria.filterByDocumentNumber(query.document_number);
    }

    if (Object.prototype.hasOwnProperty.call(query, 'name')) {
      personCriteria.filterByName(query.name);
    }

    applySorting(query, personCriteria);
    applyPagination(query, personCriteria);

    return personCriteria;
  }
}

export default PatientCriteriaTransformer;
