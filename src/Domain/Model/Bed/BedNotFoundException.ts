import ObjectNotFoundException from "../../Exception/ObjectNotFoundException";


class BedNotFoundException extends ObjectNotFoundException
{
    private readonly NAME = 'Bed';

    public getObjectName(): string
    {
        return this.NAME;
    }
}


export default BedNotFoundException;
