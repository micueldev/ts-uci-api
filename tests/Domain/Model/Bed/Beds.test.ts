import BedFactory from '~/Domain/Model/Bed/BedFactory';

import Beds from '@/Domain/Model/Bed/Beds';
import PaginatedBeds from '@/Domain/Model/Bed/PaginatedBeds';

describe('Test Beds', () => {
  it('test new bed', async () => {
    const bed = BedFactory.createNewBed({});
    expect(bed.name).toEqual('bed');
    expect(bed.description).toEqual('description of the bed');
  });

  it('test with bed', async () => {
    const bed = BedFactory.createNewBed({});
    bed.id = 1;

    const beds = new Beds([bed]);
    expect(beds.count()).toEqual(1);
    expect(beds.isEmpty()).toBeFalsy();
    expect(beds.allIndexedById()[1].id).toEqual(bed.id);
  });

  it('test without bed', async () => {
    const beds = new Beds([]);
    expect(beds.count()).toEqual(0);
    expect(beds.isEmpty()).toBeTruthy();
    expect(beds.allIndexedById()).toEqual([]);
  });

  it('test paginated beds', async () => {
    const bed = BedFactory.createNewBed({});
    bed.id = 1;

    const beds = new Beds([bed]);
    const paginated = new PaginatedBeds(beds, 10);
    expect(paginated.getBeds().count()).toEqual(1);
    expect(paginated.getBeds().isEmpty()).toBeFalsy();
    expect(paginated.getBeds().allIndexedById()[1].id).toEqual(bed.id);
    expect(paginated.getTotal()).toEqual(10);
  });
});
