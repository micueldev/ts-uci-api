import Resource from '~/Http/Model/Resource/Resource';

import Collection from '@/Domain/Model/Collection';

class Resources extends Collection {
  private resources: Array<Resource>;

  constructor(resources: Array<Resource>) {
    super();
    this.resources = resources;
  }

  public all(): Array<Resource> {
    return this.resources;
  }
}

export default Resources;
