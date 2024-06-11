import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import { IrrigantSignUp } from "../../../domain/use-cases/user";
import { forbidden, ok, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class IrrigantSignUpController extends CommandController<
    IrrigantSignUp.Request,
    HttpResponse
> {
    private signUp: IrrigantSignUp;

    constructor(signUp: IrrigantSignUp, userLogs: RegisterUserLogs) {
        super(userLogs);
        this.signUp = signUp;
    }

    async handle(request: IrrigantSignUp.Request): Promise<HttpResponse> {
        try {
            const result = await this.signUp.create(request);

            if (result.isLeft()) {
                return forbidden(result.value);
            }
            // await this.userLogs.log(request.accountId, this.signUp.useCaseLogs());
            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }
}

export namespace IrrigantSignUp {
    export type Request = {
        login: string;
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
}
