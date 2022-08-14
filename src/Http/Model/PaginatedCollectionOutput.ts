import PaginatedCollection from '../../Domain/Model/PaginatedCollection';
import Criteria from '../../Domain/Model/Criteria';


interface PaginatedOutputProps {
    items: any,
    page: number,
    limit: number,
    pages: number,
    total: number,
    params: any,
}

abstract class PaginatedCollectionOutput
{
    protected paginatedCollection!: PaginatedCollection;
    protected criteria!: Criteria;

    public constructor(paginatedCollection: PaginatedCollection, criteria: Criteria)
    {
        this.paginatedCollection = paginatedCollection;
        this.criteria = criteria;   
    }

    protected abstract toItems(): Array<any>;

    toJSON()
    {
        const { page, limit } = this.criteria.getPagination() || {};
        const total = this.paginatedCollection.getTotal();
        const pages = (limit && limit>0) ? Math.ceil(total / limit) : 0;

        return {
            items: this.toItems(),
            page: page,
            limit: limit,
            pages: pages,
            total: total,
            params: this.criteria.getParams()
        }
    }
}


export default PaginatedCollectionOutput;
