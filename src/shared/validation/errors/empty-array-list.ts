export class EmptyArrayList extends Error {
  constructor(msg: string) {
    super(`The array list is empty. ${msg}`);
    this.name = "EmptyArrayList";
  }
}
