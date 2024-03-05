import { HttpResponse } from "../../controllers/ports";

export interface Middleware<T = any> {
  handle(request: T): Promise<HttpResponse>;
}
