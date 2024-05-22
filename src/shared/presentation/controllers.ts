export interface Controller<Request = any, Response = any> {
  handle: (request: Request) => Promise<Response>;
}
