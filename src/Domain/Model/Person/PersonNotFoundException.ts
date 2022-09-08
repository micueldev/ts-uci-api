import ObjectNotFoundException from '@/Domain/Exception/ObjectNotFoundException';

class PersonNotFoundException extends ObjectNotFoundException {
  private readonly NAME = 'Person';

  public getObjectName(): string {
    return this.NAME;
  }
}

export default PersonNotFoundException;
