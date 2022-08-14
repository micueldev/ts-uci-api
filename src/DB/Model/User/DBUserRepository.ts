import 'reflect-metadata';
import { Service } from "typedi";

import UserModel from './UserModel';
import User from "../../../Domain/Model/User/User";
import UserCriteria from "../../../Domain/Model/User/UserCriteria";
import UserRepository from "../../../Domain/Model/User/UserRepository";
import CommonCriteriaBuilder from '../CommonCriteriaBuilder';
import Users from '../../../Domain/Model/User/Users';
import UserNotFoundException from '../../../Domain/Model/User/UserNotFoundException';


@Service()
class DBUserRepository implements UserRepository
{
    public async createUser(user: User): Promise<void>
    {
        const now = new Date();
        user.createdAt = now;
        user.updatedAt = now;

        const fields: Array<string> = ['username', 'firstName', 'lastName', 'email', 'isActive', 'createdAt', 'updatedAt', 'password'];

        const userModel = await UserModel.create(this.UserToValue(user, fields));
        
        user.id = userModel.id;
    }

    public async updateUser(
        user: User,
        fields: Array<string> = ['username', 'firstName', 'lastName', 'email', 'isActive']
    ): Promise<void> {
        const now = new Date();
        user.updatedAt = now;

        fields.push('updatedAt');

        const [affectedRows] = await UserModel.update(this.UserToValue(user, fields), {
            where: {
                id: user.id
            }
        });

        if (1 !== affectedRows) {
            throw new UserNotFoundException();
        }
    }

    public async findOneUserBy(userCriteria: UserCriteria): Promise<User>
    {
        const query = this.applyUserCriteriaFilters(userCriteria);

        const userModel = await UserModel.findOne({...query});

        if(!userModel) {
            throw new UserNotFoundException();
        }

        return this.modelToUser(userModel);
    }

    public async findUsersBy(userCriteria: UserCriteria): Promise<Users>
    {
        const query = this.applyUserCriteriaFilters(userCriteria);

        const userModels = await UserModel.findAll({...query});

        return new Users(
            userModels.map(userModel => this.modelToUser(userModel))
        );
    }

    public async countUsers(userCriteria: UserCriteria): Promise<number>
    {
        const query = this.applyUserCriteriaFilters(userCriteria);

        const count = await UserModel.count({...query});

        return +count;
    }

    public UserToValue(user: User, fields: Array<string>): any {
        let userValue: any = {};
        fields.forEach(function (field) {
            if (user.hasOwnProperty(field)) {
                userValue[field] = user[field as keyof User];
            }
        });

        return userValue;
    }

    public modelToUser (userModel: UserModel): User
    {
        let user = new User();
        user.id = userModel.id;
        user.username = userModel.username;
        user.firstName = userModel.firstName;
        user.lastName = userModel.lastName;
        user.email = userModel.email;
        user.isActive = userModel.isActive;
        user.createdAt = userModel.createdAt;
        user.updatedAt = userModel.updatedAt;
        user.setPassword(userModel.password);

        return user;
    }

    private applyUserCriteriaFilters(userCriteria: UserCriteria): any
    {
        let query = CommonCriteriaBuilder.buildCommonCriteria(userCriteria);

        const username = userCriteria.getUsername();
        if(username) {
            query.where.username = username;
        }

        const email = userCriteria.getEmail();
        if(email) {
            query.where.email = email;
        }

        return query;
    }
}


export default DBUserRepository;
