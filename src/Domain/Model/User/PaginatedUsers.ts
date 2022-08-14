import PaginatedCollection from '../PaginatedCollection';
import Users from './Users';


class PaginatedUsers extends PaginatedCollection
{
    private users!: Users;

    public constructor(users: Users, total: number)
    {
        super();
        this.users = users;
        this.total = total;
    }

    public getUsers(): Users
    {
        return this.users;
    }
}


export default PaginatedUsers;
