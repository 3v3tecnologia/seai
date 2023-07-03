export class QuestionAlreadyExistsError extends Error {
  constructor() {
    super("Question already exists");
    this.name = "QuestionAlreadyExistsError";
  }
}
