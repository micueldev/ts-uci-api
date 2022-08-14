import BedCriteria from '../../../Domain/Model/Bed/BedCriteria';
import { applySorting, applyPagination } from '../CriteriaTransformer';


class BedCriteriaTransformer
{
    public static createCriteriaFromQuery(query: any): BedCriteria
    {
        let userCriteria = BedCriteria.createEmpty();

        if(query.hasOwnProperty('name')){
            userCriteria.filterByName(query.name);
        }

        applySorting(query, userCriteria);
        applyPagination(query, userCriteria);

        return userCriteria;
    }
}


export default BedCriteriaTransformer;
