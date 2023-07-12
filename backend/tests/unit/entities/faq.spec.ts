import { Categories } from "../../../src/domain/entities/faq/categories";
import { Category } from "../../../src/domain/entities/faq/category";
import { Faq } from "../../../src/domain/entities/faq/faq";

let categories: Categories | null = null;
describe("#FAQ", () => {
  beforeAll(() => {
    const result = Category.create(1);
    const category = result.value as Category;
    categories = Categories.create([category]);
  });

  test("should not create a FAQ with invalid answer", () => {
    const faqOrError = Faq.create({
      question: "test is so good ?",
      answer: "",
      categories: categories as Categories,
    });

    const result = faqOrError.value as Error;

    expect(result.message).toBe("resposta não pode ser vazia");
  });

  test("should not create a FAQ with invalid question", () => {
    const faqOrError = Faq.create({
      question: "",
      answer: "test",
      categories: categories as Categories,
    });

    const result = faqOrError.value as Error;

    expect(result.message).toBe(
      "questão não pode ser vazia e nem maior do que 60"
    );
  });
  test("should not create a FAQ with question too long", () => {
    const faqOrError = Faq.create({
      question:
        "asdasdadasddsddaasdasdadasdasdasdasddjashdkasjdajdhgajdhagsdhjasgdhjasgdshjdgajshdgajhdgashjd",
      answer: "test",
      categories: categories as Categories,
    });

    const result = faqOrError.value as Error;

    expect(result.message).toBe(
      "questão não pode ser vazia e nem maior do que 60"
    );
  });
  test("should not create a FAQ without categories", () => {
    const emptyCategories = Categories.create([]);

    const faqOrError = Faq.create({
      question: "test is so good ?",
      answer: "test",
      categories: emptyCategories as Categories,
    });

    const result = faqOrError.value as Error;

    expect(result.message).toBe(
      "é necessário informar pelo menos uma categoria"
    );
  });
  test.todo("should not allow add a new category when already exists");
});
