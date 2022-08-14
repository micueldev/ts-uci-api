import PaginatedBeds from '../../../Domain/Model/Bed/PaginatedBeds';
import BedCriteria from '../../../Domain/Model/Bed/BedCriteria';
import PaginatedCollectionOutput from '../PaginatedCollectionOutput';
import BedTransformer from './BedTransformer';


class PaginatedBedsOutput extends PaginatedCollectionOutput
{
    private paginatedBeds!: PaginatedBeds;

    public constructor(paginatedBeds: PaginatedBeds, bedCriteria: BedCriteria) {
        super(paginatedBeds, bedCriteria);
        this.paginatedBeds = paginatedBeds;
    }

    protected toItems(): Array<any>
    {
        return this.paginatedBeds.getBeds().all().map(bed=>BedTransformer.bedToDefaultOutput(bed));
    }
}

export default PaginatedBedsOutput;
