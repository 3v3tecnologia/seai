import { Category } from "../../../src/domain/entities/faq/category";
import { CategoryDescription } from "../../../src/domain/entities/faq/category-description";
import { CategoryTitle } from "../../../src/domain/entities/faq/category-title";

describe("#FAQ Categories", () => {
  test("should not create a category with invalid title", () => {
    const category = Category.create(1, {
      title: "",
      description: "Manejo de irrigação",
    });

    const result = category.value as Error;
    expect(result.message).toBe(
      `título não pode ser vazia e nem maior do que ${CategoryTitle.maxLength} caracteres`
    );
  });

  test("should not create a category with invalid description", () => {
    const category = Category.create(1, {
      title: "Manejo",
      description: "",
    });

    const result = category.value as Error;

    expect(result.message).toBe(
      `descrição não pode ser vazia e nem maior do que ${CategoryDescription.maxLength} caracteres`
    );
  });

  test("should not create a category with title too long", () => {
    const category = Category.create(1, {
      title:
        "Manejo ..............................................................................",
      description: "Manejo de irrigação",
    });

    const result = category.value as Error;

    expect(result.message).toBe(
      `título não pode ser vazia e nem maior do que ${CategoryTitle.maxLength} caracteres`
    );
  });

  test("should not create a category with description too long", () => {
    const category = Category.create(1, {
      title: "Manejo",
      description:
        "Manejo de irrigação ..............................................................................",
    });

    const result = category.value as Error;

    expect(result.message).toBe(
      `descrição não pode ser vazia e nem maior do que ${CategoryDescription.maxLength} caracteres`
    );
  });
});
