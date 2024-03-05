import { Category } from "./category";

export class Categories {
  private readonly _values: Category[];

  private constructor(categories: Category[]) {
    this._values = categories;
  }

  get values(): Array<Category> {
    return this._values;
  }

  public static create(categories: Category[]): Categories {
    // será aqui que irá ter o controle de categorias repetidas?
    return new Categories(categories);
  }
}
