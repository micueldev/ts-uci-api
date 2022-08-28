import Bed from '@/Domain/Model/Bed/Bed';

class BedFactory {
  public static createNewBed({
    name = 'bed',
    description = 'description of the bed',
  }: {
    name?: string;
    description?: string | null;
  }): Bed {
    const bed = new Bed();
    bed.name = name;
    bed.description = description;

    return bed;
  }

  public static createRandomBed(): Bed {
    const id = Math.ceil(Math.random() * 10000);

    const bed = this.createNewBed({
      name: `bed${id}`,
      description: `description of the bed${id}`,
    });
    bed.id = id;

    return bed;
  }
}

export default BedFactory;
