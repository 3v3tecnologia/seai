import { HttpResponse } from "../ports/http-response";

export interface Middleware<T = any> {
  handle(request: T): Promise<HttpResponse>;
}
