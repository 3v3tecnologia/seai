// import { MailServiceError } from "../../../../../domain/use-cases/errors/mail-service-error";
// import { Either } from "../../../../../shared/Either";
// import { UserAlreadyExistsError } from "../../../core/errors/user-already-exists";
// import { UserType } from "../../../core/model/user";
// import { SystemModulesProps } from "../../../core/model/user-modules-access";

// export interface CreateUserProtocol {
//   create(
//     user: CreateUserDTO.Params
//   ): Promise<Either<UserAlreadyExistsError | MailServiceError, string>>;
// }
// export namespace CreateUserDTO {
//   type system_modules_permissions = SystemModulesProps;

//   export type Params = {
//     email: string;
//     type: UserType;
//     modules: system_modules_permissions;
//   } & CommandProps;

//   export type Result = string;
// }
