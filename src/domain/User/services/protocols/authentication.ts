import { Either } from "../../../../shared/Either";

export type AuthServiceInput = {
    login: string;
    password: string;
}

export type AuthServiceOutput = Promise<
    Either<
        Error,
        {
            accessToken: string;
        }
    >
>

export interface IAuthService {
    auth({
        login,
        password,
    }: AuthServiceInput): Promise<
        Either<
            Error,
            {
                accessToken: string;
            }
        >
    >
}

