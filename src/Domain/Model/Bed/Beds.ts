import Collection from "../Collection";
import Bed from "./Bed";


class Beds extends Collection
{
    private beds: Array<Bed>;

    constructor(beds: Array<Bed>)
    {
        super();
        this.beds = beds;
    }

    public all(): Array<Bed>
    {
        return this.beds;
    }
}


export default Beds
