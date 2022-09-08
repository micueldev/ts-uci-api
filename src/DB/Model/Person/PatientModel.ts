import { DataTypes, Model } from 'sequelize';

import db from '@/DB/connection';
// import PersonModel from '@/DB/Model/Person/PersonModel';

class PatientModel extends Model {
  id!: number;
  accountNumber!: string;
  weight!: number;
  startInstitute!: Date;
  startUci!: Date;
}

PatientModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    accountNumber: {
      field: 'account_number',
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    startInstitute: {
      field: 'start_institute',
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startUci: {
      field: 'start_uci',
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'PatientPerson',
    tableName: 'person_type_patient',
    timestamps: false,
  },
);

// PatientModel.belongsTo(PersonModel);

export default PatientModel;
