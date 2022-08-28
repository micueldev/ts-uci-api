import BaseModel from '@/Domain/Model/BaseModel';

class Bed extends BaseModel {
  public name!: string;
  public description!: string | null;
}

export default Bed;
