export class FaqNotExistsError extends Error {
  constructor() {
    super("Faq not exists");
    this.name = "FaqNotExistsError";
  }
}
