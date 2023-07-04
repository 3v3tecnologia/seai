import { UpdateFaqCategoryController } from "../../../../../presentation/controllers/faq-controller/update-faq-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateFaqCategory } from "../../use-cases/faq/update-faq-category-factory";

export const makeUpdateFaqCategoryController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["id", "title", "description"].map(
    (field) => new RequiredFieldValidator(field)
  );

  const validationComposite = new ValidatorComposite(validations);

  return makeLogControllerDecorator(
    new UpdateFaqCategoryController(
      makeUpdateFaqCategory(),
      validationComposite
    )
  );
};
