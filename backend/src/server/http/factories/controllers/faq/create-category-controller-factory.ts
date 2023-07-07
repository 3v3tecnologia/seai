import { CreateFaqCategoryController } from "../../../../../presentation/controllers/faq-controller/create-category.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeCreateFaqCategory } from "../../use-cases/faq/create-faq-category-factory";
import { makeRegisterUserLogs } from "../../use-cases/logs";

export const makeCreateFaqCategoryController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["title", "description"].map(
    (field) => new RequiredFieldValidator(field)
  );

  const validationComposite = new ValidatorComposite(validations);

  return makeLogControllerDecorator(
    new CreateFaqCategoryController(
      makeCreateFaqCategory(),
      validationComposite,
      makeRegisterUserLogs()
    )
  );
};
