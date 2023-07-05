export namespace UpdateFaqCategoryErrors {
  export class CategoryNotExists extends Error {
    constructor() {
      super("Categoria não existe");
      this.name = "CategoryNotExists";
    }
  }
}
