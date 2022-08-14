import CriteriaWithId from "../CriteriaWithId";


class BedCriteria extends CriteriaWithId
{
    private name: string|null = null;
    private deleted: boolean = false;

    public constructor () {
        super();
    }

    public static createByName<T extends BedCriteria>(this: new () => T, name: string): T
    {
        return (new this()).filterByName(name);
    }

    public filterByName(name: string): this
    {
        this.name = name
        return this;
    }

    public getName(): string|null
    {
        return this.name;
    }

    public addDeleted(deleted: boolean): this
    {
        this.deleted = deleted
        return this;
    }

    public showDeleted(): boolean
    {
        return this.deleted;
    }

    public getAllParams() {
        return {
            name: this.name
        }
    }
}


export default BedCriteria;
