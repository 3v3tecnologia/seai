import { UpdateFaqController } from "../../../../../presentation/controllers/faq-controller/update.controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { AgainstEmptyArrayList } from "../../../../../shared/validation/validator/against-empty-array-list";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUpdateFaq } from "../../use-cases/faq/update-faq-factory";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";

export const makeUpdateFaqController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["id", "question", "answer", "order", "categories"].map(
    (field) => new RequiredFieldValidator(field)
  );

  validations.push(new AgainstEmptyArrayList("categories"));

  const validationComposite = new ValidatorComposite(validations);
  return makeLogControllerDecorator(
    new UpdateFaqController(
      makeUpdateFaq(),
      validationComposite,
      makeRegisterUserLogs()
    )
  );
};
