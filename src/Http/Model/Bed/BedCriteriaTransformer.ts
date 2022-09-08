import BedCriteria from '@/Domain/Model/Bed/BedCriteria';
import {
  applySorting,
  applyPagination,
} from '@/Http/Model/CriteriaTransformer';

class BedCriteriaTransformer {
  public static createCriteriaFromQuery(query: any): BedCriteria {
    const bedCriteria = BedCriteria.createEmpty();

    if (Object.prototype.hasOwnProperty.call(query, 'name')) {
      bedCriteria.filterByName(query.name);
    }

    applySorting(query, bedCriteria);
    applyPagination(query, bedCriteria);

    return bedCriteria;
  }
}

export default BedCriteriaTransformer;
