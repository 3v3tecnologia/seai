export class CreateUser {
  private readonly repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }
  async execute() {
    console.log("Hello");
  }
}
