import { DataTypes, Model } from 'sequelize';

import db from '@/DB/connection';
import PatientModel from '@/DB/Model/Person/PatientModel';
import TechnicalModel from '@/DB/Model/Person/TechnicalModel';

class PersonModel extends Model {
  id!: number;
  type!: string;
  firstName!: string;
  lastName!: string;
  birthDate!: Date | null;
  documentNumber!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}

PersonModel.init(
  {
    type: {
      type: DataTypes.STRING(3),
      field: 'type',
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(200),
      field: 'first_name',
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(200),
      field: 'last_name',
      allowNull: false,
    },
    birthDate: {
      field: 'birth_date',
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    documentNumber: {
      field: 'document_number',
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    modelName: 'Person',
    tableName: 'person',
    timestamps: false,
    indexes: [
      {
        name: 'type_index',
        using: 'BTREE',
        unique: false,
        fields: ['type'],
      },
    ],
  },
);

PersonModel.hasOne(PatientModel, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'id',
});

PersonModel.hasOne(TechnicalModel, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'id',
});

export default PersonModel;
