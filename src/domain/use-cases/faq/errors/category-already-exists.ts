export namespace CreateFaqCategoryErrors {
    export class CategoryAlreadyExists extends Error {
        constructor() {
            super("Categoria já existe");
            this.name = "CategoryAlreadyExists";
        }
    }
}
