import PaginatedUsers from '../../../Domain/Model/User/PaginatedUsers';
import UserCriteria from '../../../Domain/Model/User/UserCriteria';
import PaginatedCollectionOutput from '../PaginatedCollectionOutput';
import UserTransformer from './UserTransformer';


class PaginatedUsersOutput extends PaginatedCollectionOutput
{
    private paginatedUsers!: PaginatedUsers;

    public constructor(paginatedUsers: PaginatedUsers, userCriteria: UserCriteria) {
        super(paginatedUsers, userCriteria);
        this.paginatedUsers = paginatedUsers;
    }

    protected toItems(): Array<any>
    {
        return this.paginatedUsers.getUsers().all().map(user=>UserTransformer.userToDefaultOutput(user));
    }
}

export default PaginatedUsersOutput;
