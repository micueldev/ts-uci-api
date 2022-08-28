import PaginatedResources from '~/Http/Model/Resource/PaginatedResources';
import ResourceCriteria from '~/Http/Model/Resource/ResourceCriteria';

import PaginatedCollectionOutput from '@/Http/Model/PaginatedCollectionOutput';

class PaginatedResourcesOutput extends PaginatedCollectionOutput {
  private paginatedResources!: PaginatedResources;

  public constructor(
    paginatedResources: PaginatedResources,
    resourceCriteria: ResourceCriteria,
  ) {
    super(paginatedResources, resourceCriteria);
    this.paginatedResources = paginatedResources;
  }

  protected toItems(): Array<any> {
    return this.paginatedResources.getResources().all();
  }
}

export default PaginatedResourcesOutput;
