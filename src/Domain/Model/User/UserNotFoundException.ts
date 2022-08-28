import ObjectNotFoundException from '@/Domain/Exception/ObjectNotFoundException';

class UserNotFoundException extends ObjectNotFoundException {
  private readonly NAME = 'User';

  public getObjectName(): string {
    return this.NAME;
  }
}

export default UserNotFoundException;
