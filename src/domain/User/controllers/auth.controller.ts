import { HttpResponse } from "../../../shared/ports/http-response";
import {
    badRequest,
    forbidden,
    ok,
    serverError
} from "../../../shared/utils/http-responses";
import { authService } from "../services/factories/auth";
import { loginValidator } from "./schema/gov-user";

export class AuthenticationController {
    static async login(request: {
        login: string;
        password: string;
    }): Promise<HttpResponse> {
        try {
            const { login, password } = request;

            const { error } = await loginValidator.validate({
                login,
                password,
            });

            if (error) {
                return badRequest(error);
            }
            const result = await authService.auth(request);

            if (result.isLeft()) {
                return forbidden(result.value);
            }
            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }
}
