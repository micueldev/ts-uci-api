import BedFactory from '~/Domain/Model/Bed/BedFactory';

import BedRepository from '@/DB/Model/Bed/BedRepository';
import BedModel from '@/DB/Model/Bed/BedModel';
import Bed from '@/Domain/Model/Bed/Bed';
import BedCriteria from '@/Domain/Model/Bed/BedCriteria';
import BedNotFoundException from '@/Domain/Model/Bed/BedNotFoundException';

let bedRepository: BedRepository;

beforeAll(async () => {
  bedRepository = new BedRepository();
});

describe('Test BedRepository', () => {
  beforeEach(async () => {
    await BedModel.sync();
  });

  afterEach(async () => {
    await BedModel.drop();
  });

  it('test get not found', async () => {
    try {
      await bedRepository.findOneBedBy(BedCriteria.createById(1));
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new BedNotFoundException());
    }
  });

  it('test create bed', async () => {
    const bed = BedFactory.createNewBed({});
    expect(bed.id).toBeNull();

    await bedRepository.createBed(bed);

    const bedCreated = await bedRepository.findOneBedBy(
      BedCriteria.createById(bed.id!),
    );

    expect(bedCreated.id).not.toBeNull();
    expect(bedCreated.id).toEqual(bed.id);
    expect(bedCreated.name).toEqual(bed.name);
    expect(bedCreated.description).toEqual(bed.description);
  });

  it('test update bed', async () => {
    const bed = await createAndGetBed(bedRepository);

    const name = (bed.name = 'ABC123');
    const description = (bed.description = null);

    await bedRepository.updateBed(bed);
    const bedUpdated = await bedRepository.findOneBedBy(
      BedCriteria.createById(bed.id!),
    );

    expect(bedUpdated.name).toEqual(name);
    expect(bedUpdated.description).toEqual(description);
  });

  it('test update not found', async () => {
    try {
      const bed = BedFactory.createNewBed({});
      bed.id = 1;
      await bedRepository.updateBed(bed);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new BedNotFoundException());
    }
  });

  it('test delete bed', async () => {
    const bed = await createAndGetBed(bedRepository);

    await bedRepository.deleteBedById(bed.id!);

    try {
      await bedRepository.findOneBedBy(BedCriteria.createById(bed.id!));
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new BedNotFoundException());
    }
  });

  it('test delete bed', async () => {
    const bed = await createAndGetBed(bedRepository);

    await bedRepository.deleteBedById(bed.id!);

    try {
      await bedRepository.findOneBedBy(BedCriteria.createById(bed.id!));
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new BedNotFoundException());
    }
  });

  it('test double delete bed', async () => {
    const bed = await createAndGetBed(bedRepository);

    await bedRepository.deleteBedById(bed.id!);

    try {
      await bedRepository.deleteBedById(bed.id!);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new BedNotFoundException());
    }
  });

  it('test delete not found', async () => {
    try {
      await bedRepository.deleteBedById(1234);
      throw new Error('Bad test');
    } catch (err) {
      expect(err).toMatchObject(new BedNotFoundException());
    }
  });

  it('test count beds', async () => {
    const bed = await createAndGetBed(bedRepository);

    const bed2 = BedFactory.createNewBed({
      name: 'DEF',
      description: 'it is a bed',
    });
    await bedRepository.createBed(bed2);

    let beds = await bedRepository.findBedsBy(BedCriteria.createById(bed.id!));
    expect(beds.count()).toEqual(1);

    beds = await bedRepository.findBedsBy(
      BedCriteria.createByIds([bed.id!, bed2.id!]),
    );
    expect(beds.count()).toEqual(2);

    beds = await bedRepository.findBedsBy(BedCriteria.createByIds([bed2.id!]));
    expect(beds.count()).toEqual(1);
  });

  it('test filter beds', async () => {
    const bed = await createAndGetBed(bedRepository);

    const bed2 = BedFactory.createNewBed({
      name: 'DEF',
      description: 'it is a bed',
    });
    await bedRepository.createBed(bed2);

    let beds = await bedRepository.findBedsBy(
      BedCriteria.createByIds([bed.id!, bed2.id!]),
    );
    expect(beds.count()).toEqual(2);

    beds = await bedRepository.findBedsBy(BedCriteria.createByIds([bed2.id!]));
    expect(beds.count()).toEqual(1);

    beds = await bedRepository.findBedsBy(BedCriteria.createByName(bed2.name));
    expect(beds.count()).toEqual(1);

    await bedRepository.deleteBedById(bed2.id!);
    beds = await bedRepository.findBedsBy(
      BedCriteria.createByIds([bed.id!, bed2.id!]),
    );
    expect(beds.count()).toEqual(1);
  });
});

const createBed = async (bedRepository: BedRepository): Promise<Bed> => {
  const bed = BedFactory.createNewBed({});
  await bedRepository.createBed(bed);
  return bed;
};

const createAndGetBed = async (bedRepository: BedRepository): Promise<Bed> => {
  const bed = await createBed(bedRepository);
  return bedRepository.findOneBedBy(BedCriteria.createById(bed.id!));
};
