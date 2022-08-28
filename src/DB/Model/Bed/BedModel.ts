import { DataTypes, Model } from 'sequelize';

import db from '@/DB/connection';

class BedModel extends Model {
  id!: number;
  name!: string;
  description!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}

BedModel.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true,
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
    modelName: 'Bed',
    tableName: 'bed',
    timestamps: false,
  },
);

export default BedModel;
