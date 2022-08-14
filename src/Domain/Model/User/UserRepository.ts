import User from './User';
import UserCriteria from './UserCriteria';
import Users from './Users';


interface UserRepository {
    createUser(user: User): Promise<void>;

    updateUser(user: User, fields: Array<string>): Promise<void>;

    findOneUserBy(userCriteria: UserCriteria): Promise<User>;

    findUsersBy(userCriteria: UserCriteria): Promise<Users>;

    countUsers(userCriteria: UserCriteria): Promise<number>;
}


export default UserRepository;
