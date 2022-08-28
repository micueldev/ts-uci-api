import ResourceCriteria from '~/Http/Model/Resource/ResourceCriteria';

import {
  applySorting,
  applyPagination,
} from '@/Http/Model/CriteriaTransformer';

describe('Test CriteriaTransformer', () => {
  it('Test applySorting from query', async () => {
    const direction = 'DESC';

    const resourceCriteria = new ResourceCriteria();
    const query = {
      sorting: `created_at:${direction}`,
    };
    applySorting(query, resourceCriteria);

    const sorting = resourceCriteria.getSorting();
    expect(sorting).not.toBeNull();

    expect(sorting!.field).toEqual('createdAt');
    expect(sorting!.direction).toEqual(direction);
  });

  it('Test applySorting default', async () => {
    const resourceCriteria = new ResourceCriteria();
    const query = {
      sorting: `:`,
    };
    applySorting(query, resourceCriteria);

    const sorting = resourceCriteria.getSorting();
    expect(sorting).not.toBeNull();

    expect(sorting!.field).toEqual('id');
    expect(sorting!.direction).toEqual('ASC');
  });

  it('Test not applySorting', async () => {
    const resourceCriteria = new ResourceCriteria();
    const query = {
      pagination: `:`,
    };
    applySorting(query, resourceCriteria);

    const sorting = resourceCriteria.getSorting();
    expect(sorting).toBeNull();
  });

  it('Test applyPagination from query pagination', async () => {
    const page = 2;
    const limit = 15;

    const resourceCriteria = new ResourceCriteria();
    const query = {
      pagination: `${page}:${limit}`,
    };
    applyPagination(query, resourceCriteria);

    const pagination = resourceCriteria.getPagination();
    expect(pagination).not.toBeNull();

    expect(pagination!.page).toEqual(page);
    expect(pagination!.limit).toEqual(limit);
  });

  it('Test applyPagination from pagination default', async () => {
    const resourceCriteria = new ResourceCriteria();
    const query = {
      pagination: `:`,
    };
    applyPagination(query, resourceCriteria);

    const pagination = resourceCriteria.getPagination();
    expect(pagination).not.toBeNull();

    expect(pagination!.page).toEqual(1);
    expect(pagination!.limit).toEqual(10);
  });

  it('Test applyPagination from query page and default limit', async () => {
    const page = 3;

    const resourceCriteria = new ResourceCriteria();
    const query = {
      page,
    };
    applyPagination(query, resourceCriteria);

    const pagination = resourceCriteria.getPagination();
    expect(pagination).not.toBeNull();

    expect(pagination!.page).toEqual(page);
    expect(pagination!.limit).toEqual(10);
  });

  it('Test applyPagination from query limit and default page', async () => {
    const limit = 2;

    const resourceCriteria = new ResourceCriteria();
    const query = {
      limit,
    };
    applyPagination(query, resourceCriteria);

    const pagination = resourceCriteria.getPagination();
    expect(pagination).not.toBeNull();

    expect(pagination!.page).toEqual(1);
    expect(pagination!.limit).toEqual(limit);
  });

  it('Test applyPagination from default page and limit', async () => {
    const resourceCriteria = new ResourceCriteria();
    const query = {};
    applyPagination(query, resourceCriteria);

    const pagination = resourceCriteria.getPagination();
    expect(pagination).not.toBeNull();

    expect(pagination!.page).toEqual(1);
    expect(pagination!.limit).toEqual(10);
  });
});
