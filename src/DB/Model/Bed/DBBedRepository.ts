import 'reflect-metadata';
import { Service } from "typedi";

import BedModel from './BedModel';
import Bed from "../../../Domain/Model/Bed/Bed";
import BedCriteria from "../../../Domain/Model/Bed/BedCriteria";
import BedRepository from "../../../Domain/Model/Bed/BedRepository";
import CommonCriteriaBuilder from '../CommonCriteriaBuilder';
import Beds from '../../../Domain/Model/Bed/Beds';
import BedNotFoundException from '../../../Domain/Model/Bed/BedNotFoundException';


@Service()
class DBBedRepository implements BedRepository
{
    public async createBed(bed: Bed): Promise<void>
    {
        const now = new Date();
        bed.createdAt = now;
        bed.updatedAt = now;

        const fields: Array<string> = ['name', 'description', 'createdAt', 'updatedAt'];

        const bedModel = await BedModel.create(this.BedToValue(bed, fields));
        
        bed.id = bedModel.id;
    }

    public async updateBed(
        bed: Bed,
        fields: Array<string> = ['name', 'description']
    ): Promise<void> {
        const now = new Date();
        bed.updatedAt = now;

        fields.push('updatedAt');

        const [affectedRows] = await BedModel.update(this.BedToValue(bed, fields), {
            where: {
                id: bed.id
            }
        });

        if (1 !== affectedRows) {
            throw new BedNotFoundException();
        }
    }

    public async findOneBedBy(bedCriteria: BedCriteria): Promise<Bed>
    {
        const query = this.applyBedCriteriaFilters(bedCriteria);

        const bedModel = await BedModel.findOne({...query});

        if(!bedModel) {
            throw new BedNotFoundException();
        }

        return this.modelToBed(bedModel);
    }

    public async findBedsBy(bedCriteria: BedCriteria): Promise<Beds>
    {
        const query = this.applyBedCriteriaFilters(bedCriteria);

        const bedModels = await BedModel.findAll({...query});

        return new Beds(
            bedModels.map(bedModel => this.modelToBed(bedModel))
        );
    }

    public async countBeds(bedCriteria: BedCriteria): Promise<number>
    {
        const query = this.applyBedCriteriaFilters(bedCriteria);

        const count = await BedModel.count({...query});

        return +count;
    }

    public BedToValue(bed: Bed, fields: Array<string>): any {
        let bedValue: any = {};
        fields.forEach(function (field) {
            if (bed.hasOwnProperty(field)) {
                bedValue[field] = bed[field as keyof Bed];
            }
        });

        return bedValue;
    }

    public modelToBed (bedModel: BedModel): Bed
    {
        let bed = new Bed();
        bed.id = bedModel.id;
        bed.name = bedModel.name;
        bed.description = bedModel.description;
        bed.createdAt = bedModel.createdAt;
        bed.updatedAt = bedModel.updatedAt;
        bed.deletedAt = bedModel.deletedAt;

        return bed;
    }

    private applyBedCriteriaFilters(bedCriteria: BedCriteria): any
    {
        let query = CommonCriteriaBuilder.buildCommonCriteria(bedCriteria);

        if(!bedCriteria.showDeleted()) {
            query.where.deletedAt = null;
        }

        const name = bedCriteria.getName();
        if(name) {
            query.where.name = name;
        }

        return query;
    }

    public async deleteBedById( id: number ): Promise<void> {
        const now = new Date();

        const [affectedRows] = await BedModel.update({
            deletedAt: now
        }, {
            where: {
                    id,
                    deletedAt: null
                }
        });

        if (1 !== affectedRows) {
            throw new BedNotFoundException();
        }
    }
}


export default DBBedRepository;
