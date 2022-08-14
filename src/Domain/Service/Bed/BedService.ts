import 'reflect-metadata';
import { Service, Inject } from "typedi";
import DBBedRepository from '../../../DB/Model/Bed/DBBedRepository';
import Bed from '../../Model/Bed/Bed';
import BedCriteria from '../../Model/Bed/BedCriteria';
import PaginatedBeds from '../../Model/Bed/PaginatedBeds';
import BadRequestException from '../../Exception/BadRequestException';
import BedNotFoundException from '../../Model/Bed/BedNotFoundException';


@Service()
class BedService
{
    @Inject()
    bedRepository!: DBBedRepository;

    public async getBeds(bedCriteria: BedCriteria): Promise<PaginatedBeds>{
        const beds = await this.bedRepository.findBedsBy(bedCriteria);
        const count = await this.bedRepository.countBeds(bedCriteria);

        return new PaginatedBeds(beds, count);
    }

    public async getBed(bedCriteria: BedCriteria): Promise<Bed>{
        return this.bedRepository.findOneBedBy(bedCriteria);
    }

    public async createBed(bed: Bed): Promise<Bed>
    {
        try {
            const existName = await this.bedRepository.findOneBedBy(BedCriteria.createByName(bed.name));
            if(existName){
                throw new BadRequestException('Name already exists');
            }
        } catch (err){
            if(err instanceof BedNotFoundException == false){
                throw err;
            }
        }

        await this.bedRepository.createBed(bed);

        return bed;
    }

    public async updateBed(bed: Bed): Promise<Bed>
    {        
        try {
            const existName = await this.bedRepository.findOneBedBy(BedCriteria.createByName(bed.name));
            if(existName && existName.id != bed.id){
                throw new BadRequestException('Name already exists');
            }
        } catch (err){
            if(err instanceof BedNotFoundException == false){
                throw err;
            }
        }

        let bedSaved = await this.bedRepository.findOneBedBy(BedCriteria.createById(bed.id!));        
        bedSaved.name = bed.name;
        bedSaved.description = bed.description;

        await this.bedRepository.updateBed(
            bedSaved,
            ['name', 'description']
        );
        
        return bedSaved;
    }

    public async deleteBed(id: number): Promise<void>
    {
        await this.bedRepository.deleteBedById(id);
    }
}


export default BedService;
