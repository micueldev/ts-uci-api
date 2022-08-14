import BaseModelId from './BaseModelId';


abstract class Collection
{
    public abstract all(): Array<any>;
 
    public allIndexedById(): Array<BaseModelId>
    {
        let allIndexedById: any = [];

        if(!this.isEmpty()){
            const all = this.all();

            if(all[0] instanceof BaseModelId){
                all.forEach((model: BaseModelId) => {
                    allIndexedById[model.id!] = model.id;
                });
            }
        }

        return allIndexedById;
    }
 
    public isEmpty(): boolean
    {
        return !(this.all().length);
    }

    public count(): number
    {
        return this.all().length;
    }
}


export default Collection;
