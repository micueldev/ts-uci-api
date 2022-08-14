import Bed from './Bed';
import BedCriteria from './BedCriteria';
import Beds from './Beds';


interface BedRepository {
    createBed(bed: Bed): Promise<void>;

    updateBed(bed: Bed, fields: Array<string>): Promise<void>;

    findOneBedBy(bedCriteria: BedCriteria): Promise<Bed>;

    findBedsBy(bedCriteria: BedCriteria): Promise<Beds>;

    countBeds(bedCriteria: BedCriteria): Promise<number>;

    deleteBedById(id: number): Promise<void>;
}


export default BedRepository;
