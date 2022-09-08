import { DataTypes, Model } from 'sequelize';

import db from '@/DB/connection';
// import PersonModel from '@/DB/Model/Person/PersonModel';

class TechnicalModel extends Model {
  id!: number;
}

TechnicalModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    sequelize: db,
    modelName: 'TechnicalPerson',
    tableName: 'person_type_technical',
    timestamps: false,
  },
);

// TechnicalModel.belongsTo(PersonModel);

export default TechnicalModel;
