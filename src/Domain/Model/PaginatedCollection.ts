abstract class PaginatedCollection {
  protected total!: number;

  public getTotal(): number {
    return this.total;
  }
}

export default PaginatedCollection;
