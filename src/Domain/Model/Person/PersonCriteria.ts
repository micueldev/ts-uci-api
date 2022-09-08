import CriteriaWithId from '@/Domain/Model/CriteriaWithId';

class PersonCriteria extends CriteriaWithId {
  private type: string | null = null;
  private documentNumber: string | null = null;
  private name: string | null = null;

  public constructor() {
    super();
  }

  public static createByType<T extends PersonCriteria>(
    this: new () => T,
    type: string,
  ): T {
    return new this().filterByType(type);
  }

  public filterByType(type: string): this {
    this.type = type;
    return this;
  }

  public getType(): string | null {
    return this.type;
  }

  public static createByDocumentNumber<T extends PersonCriteria>(
    this: new () => T,
    documentNumber: string,
  ): T {
    return new this().filterByDocumentNumber(documentNumber);
  }

  public filterByDocumentNumber(documentNumber: string): this {
    this.documentNumber = documentNumber;
    return this;
  }

  public getDocumentNumber(): string | null {
    return this.documentNumber;
  }

  public static createByName<T extends PersonCriteria>(
    this: new () => T,
    name: string,
  ): T {
    return new this().filterByName(name);
  }

  public filterByName(name: string): this {
    this.name = name;
    return this;
  }

  public getName(): string | null {
    return this.name;
  }

  public getAllParams() {
    return {
      document_number: this.documentNumber,
      name: this.name,
    };
  }
}

export default PersonCriteria;
