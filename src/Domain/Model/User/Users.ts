import Collection from "../Collection";
import User from "./User";


class Users extends Collection
{
    private users: Array<User>;

    constructor(users: Array<User>)
    {
        super();
        this.users = users;
    }

    public all(): Array<User>
    {
        return this.users;
    }
}


export default Users
