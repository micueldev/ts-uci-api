import BedCriteria from '@/Domain/Model/Bed/BedCriteria';
import {
  applySorting,
  applyPagination,
} from '@/Http/Model/CriteriaTransformer';

class BedCriteriaTransformer {
  public static createCriteriaFromQuery(query: any): BedCriteria {
    const userCriteria = BedCriteria.createEmpty();

    if (Object.prototype.hasOwnProperty.call(query, 'name')) {
      userCriteria.filterByName(query.name);
    }

    applySorting(query, userCriteria);
    applyPagination(query, userCriteria);

    return userCriteria;
  }
}

export default BedCriteriaTransformer;
