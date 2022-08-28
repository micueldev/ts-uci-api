import UserCriteria from '@/Domain/Model/User/UserCriteria';
import {
  applySorting,
  applyPagination,
} from '@/Http/Model/CriteriaTransformer';

class UserCriteriaTransformer {
  public static createCriteriaFromQuery(query: any): UserCriteria {
    const userCriteria = UserCriteria.createEmpty();

    if (Object.prototype.hasOwnProperty.call(query, 'username')) {
      userCriteria.filterByUsername(query.username);
    }

    if (Object.prototype.hasOwnProperty.call(query, 'email')) {
      userCriteria.filterByEmail(query.email);
    }

    applySorting(query, userCriteria);
    applyPagination(query, userCriteria);

    return userCriteria;
  }
}

export default UserCriteriaTransformer;
