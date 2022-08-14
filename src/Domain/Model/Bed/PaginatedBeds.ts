import PaginatedCollection from '../PaginatedCollection';
import Beds from './Beds';


class PaginatedBeds extends PaginatedCollection
{
    private beds!: Beds;

    public constructor(beds: Beds, total: number)
    {
        super();
        this.beds = beds;
        this.total = total;
    }

    public getBeds(): Beds
    {
        return this.beds;
    }
}


export default PaginatedBeds;
