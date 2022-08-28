import Bed from '@/Domain/Model/Bed/Bed';
import BedCriteria from '@/Domain/Model/Bed/BedCriteria';
import Beds from '@/Domain/Model/Bed/Beds';

interface IBedRepository {
  createBed(bed: Bed): Promise<void>;

  updateBed(bed: Bed, fields: Array<string>): Promise<void>;

  findOneBedBy(bedCriteria: BedCriteria): Promise<Bed>;

  findBedsBy(bedCriteria: BedCriteria): Promise<Beds>;

  countBeds(bedCriteria: BedCriteria): Promise<number>;

  deleteBedById(id: number): Promise<void>;
}

export default IBedRepository;
