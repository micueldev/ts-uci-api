import { DataTypes, Model } from 'sequelize';

import db from '../../connection';


class UserModel extends Model
{
    id!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}

UserModel.init({
    username: {
        type: DataTypes.STRING(100),
        field: 'username',
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING(200),
        field: 'first_name',
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(200),
        field: 'last_name',
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
        allowNull: false,
        defaultValue: true
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'user',
    timestamps: false,
});


export default UserModel;
