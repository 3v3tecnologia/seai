export class UnmatchedFields extends Error {
  constructor(field: string) {
    super(`The ${field} is not matched`);
    this.name = "UnmatchedFields";
  }
}
