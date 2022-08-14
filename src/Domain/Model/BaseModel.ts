import BaseModelId from './BaseModelId';


abstract class BaseModel extends BaseModelId
{
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date|null = null;

    public constructor()
    {
        super();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}


export default BaseModel;
