abstract class ObjectNotFoundException extends Error {
  private readonly STATUS = 404;

  public getStatus(): number {
    return this.STATUS;
  }

  public getMessage(): string {
    return `${this.getObjectName()} not found`;
  }

  public abstract getObjectName(): string;
}

export default ObjectNotFoundException;
