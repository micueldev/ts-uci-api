interface PaginationProps {
  page: number;
  limit: number;
  offset: number;
}

type Direction = 'ASC' | 'DESC';

interface SortingProps {
  field: string;
  direction: Direction;
}

abstract class Criteria {
  public static readonly DIRECTION_ASC = 'ASC';
  public static readonly DIRECTION_DESC = 'DESC';

  private pagination: PaginationProps | null = null;
  private sorting: SortingProps | null = null;

  public static createEmpty<T extends Criteria>(this: new () => T): T {
    return new this();
  }

  public paginate(page: number, limit: number): this {
    if (page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      this.pagination = {
        page,
        limit,
        offset,
      };
    }

    return this;
  }

  public sortBy(field: string, direction: Direction): this {
    if (field.trim().length && direction != null) {
      this.sorting = {
        field,
        direction,
      };
    }

    return this;
  }

  public getPagination(): PaginationProps | null {
    return this.pagination;
  }

  public getSorting(): SortingProps | null {
    return this.sorting;
  }

  public abstract getAllParams(): any;

  public getParams(): any {
    const params = this.getAllParams();
    for (const key in params) {
      if (params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    }

    return params;
  }
}

export default Criteria;
