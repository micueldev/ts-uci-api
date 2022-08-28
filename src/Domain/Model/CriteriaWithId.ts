import Criteria from '@/Domain/Model/Criteria';

abstract class CriteriaWithId extends Criteria {
  private id: number | null = null;
  private ids: Array<number> | null = null;

  public static createById<T extends CriteriaWithId>(
    this: new () => T,
    id: number,
  ): T {
    return new this().filterById(id);
  }

  public static createByIds<T extends CriteriaWithId>(
    this: new () => T,
    ids: Array<number>,
  ): T {
    return new this().filterByIds(ids);
  }

  public filterById(id: number): this {
    this.id = id;

    return this;
  }

  public filterByIds(ids: Array<number>): this {
    this.ids = ids;

    return this;
  }

  public getId(): number | null {
    return this.id;
  }

  public getIds(): Array<number> | null {
    return this.ids;
  }
}

export default CriteriaWithId;
