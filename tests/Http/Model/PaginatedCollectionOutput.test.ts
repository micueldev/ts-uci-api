import PaginatedResources from '~/Http/Model/Resource/PaginatedResources';
import PaginatedResourcesOutput from '~/Http/Model/Resource/PaginatedResourcesOutput';
import Resource from '~/Http/Model/Resource/Resource';
import ResourceCriteria from '~/Http/Model/Resource/ResourceCriteria';
import Resources from '~/Http/Model/Resource/Resources';

describe('Test PaginatedCollection', () => {
  it('Test json format', async () => {
    const resource1 = new Resource();
    resource1.id = 23;
    const resource2 = new Resource();
    resource2.id = 45455;

    const resources = new Resources([resource1, resource2]);

    const total = 30;
    const paginatedResources = new PaginatedResources(resources, total);

    const page = 2;
    const limit = 5;
    const resourceCriteria = ResourceCriteria.createEmpty()
      .sortBy('id', 'ASC')
      .paginate(page, limit);

    const paginatedResourcesOutput = new PaginatedResourcesOutput(
      paginatedResources,
      resourceCriteria,
    );

    const paginatedResourcesOutputObject = JSON.parse(
      JSON.stringify(paginatedResourcesOutput),
    );

    expect(paginatedResourcesOutputObject.items[0]).toEqual({
      id: resource1.id,
    });
    expect(paginatedResourcesOutputObject.items[1]).toEqual({
      id: resource2.id,
    });

    expect(paginatedResourcesOutputObject.page).toEqual(page);
    expect(paginatedResourcesOutputObject.limit).toEqual(limit);
    expect(paginatedResourcesOutputObject.pages).toEqual(6);
    expect(paginatedResourcesOutputObject.total).toEqual(total);
  });

  it('Test json format with criteria empty', async () => {
    const resources = new Resources([]);

    const total = 30;
    const paginatedResources = new PaginatedResources(resources, total);

    const resourceCriteria = ResourceCriteria.createEmpty();

    const paginatedResourcesOutput = new PaginatedResourcesOutput(
      paginatedResources,
      resourceCriteria,
    );

    const paginatedResourcesOutputObject = JSON.parse(
      JSON.stringify(paginatedResourcesOutput),
    );

    expect(paginatedResourcesOutputObject.pages).toEqual(0);
    expect(paginatedResourcesOutputObject.total).toEqual(total);
  });
});
