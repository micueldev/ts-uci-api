import UserCriteria from '../../../Domain/Model/User/UserCriteria';
import { applySorting, applyPagination } from '../CriteriaTransformer';


class UserCriteriaTransformer
{
    public static createCriteriaFromQuery(query: any): UserCriteria
    {
        let userCriteria = UserCriteria.createEmpty();

        if(query.hasOwnProperty('username')){
            userCriteria.filterByUsername(query.username);
        }

        if(query.hasOwnProperty('email')){
            userCriteria.filterByUsername(query.email);
        }

        applySorting(query, userCriteria);
        applyPagination(query, userCriteria);

        return userCriteria;
    }
}


export default UserCriteriaTransformer;
