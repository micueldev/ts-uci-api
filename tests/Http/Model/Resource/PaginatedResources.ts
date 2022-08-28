import Resources from '~/Http/Model/Resource/Resources';

import PaginatedCollection from '@/Domain/Model/PaginatedCollection';

class PaginatedResources extends PaginatedCollection {
  private resources!: Resources;

  public constructor(resources: Resources, total: number) {
    super();
    this.resources = resources;
    this.total = total;
  }

  public getResources(): Resources {
    return this.resources;
  }
}

export default PaginatedResources;
