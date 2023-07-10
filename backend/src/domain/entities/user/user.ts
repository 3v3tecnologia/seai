import { Either, left, right } from "../../../shared/Either";
import {
  againstNullOrUndefinedBulk,
  concatenateMessages,
} from "../../../shared/Guard";
import { Email } from "./email";
import { InvalidEmailError } from "./errors/invalid-email";
import { PasswordErrors } from "./errors/invalid-password";
import { UserModuleAccessErrors } from "./errors/invalid-user-permissions";
import { UserLogin } from "./login";
import { UserName } from "./name";

import { SystemModules } from "./user-modules-access";
import { UserPassword } from "./userPassword";

export type UserType = "admin" | "standard";
interface UserProps {
  name?: UserName;
  login?: UserLogin;
  email: Email;
  password?: UserPassword | null;
  modulesAccess?: SystemModules;
  type: UserType;
}

export class User {
  private readonly _id: number | null;
  private _name: UserName | null;
  private _login: UserLogin | null;
  private _email: Email;
  private _password: UserPassword | null;
  public type: UserType;
  public readonly modulesAccess: SystemModules | null;

  private constructor(props: UserProps, id?: number) {
    this._id = id || null;
    this._email = props.email;
    this.type = props.type;
    this.modulesAccess = props.modulesAccess || null;
    this._name = props.name || null;
    this._login = props.login || null;
    this._password = props.password || null;
  }

  get id(): number | null {
    return this._id;
  }

  get login(): UserLogin | null {
    return this._login;
  }
  get name(): UserName | null {
    return this._name;
  }

  get email(): Email | null {
    return this._email;
  }

  get password(): UserPassword | null {
    return this._password;
  }

  public setEmail(email: Email) {
    this._email = email;
  }
  public setName(name: UserName) {
    this._name = name;
  }
  public setLogin(login: UserLogin) {
    this._login = login;
  }
  public setPassword(password: UserPassword) {
    this._password = password;
  }

  private static hasAdminPermission(module: any) {
    return module.read === true && module.write === true;
  }

  static createStartAccount(
    props: {
      email: Email;
      type: UserType;
      modulesAccess: SystemModules;
    },
    id?: number
  ): Either<Error, User> {
    const result = againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: "Email" },
      { argument: props.type, argumentName: "Tipo" },
      { argument: props.modulesAccess, argumentName: "Módulos" },
    ]);

    if (result.isLeft()) {
      return left(new Error(concatenateMessages(result.value)));
    }

    if (props.type === "admin") {
      const hasAdminPermissions = [
        User.hasAdminPermission(props.modulesAccess.value.news_manager),
        User.hasAdminPermission(props.modulesAccess.value.registers),
        User.hasAdminPermission(props.modulesAccess.value.users_manager),
      ].every((permission) => permission === true);

      if (hasAdminPermissions === false) {
        return left(
          new UserModuleAccessErrors.InvalidUserAdminPermissionsError()
        );
      }
    }

    if (props.type === "standard") {
      const hasUserManageAccess =
        props.modulesAccess.value.users_manager.read ||
        props.modulesAccess.value.users_manager.write;

      if (hasUserManageAccess) {
        return left(
          new UserModuleAccessErrors.InvalidBasicUserPermissionsError()
        );
      }
    }

    return right(new User(props, id));
  }

  static createEndAccount(props: {
    email: Email;
    name: UserName;
    login: UserLogin;
    password: UserPassword;
  }) {
    const result = againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: "Email" },
      { argument: props.name, argumentName: "Nome" },
      { argument: props.login, argumentName: "Login" },
      { argument: props.password, argumentName: "Senha" },
    ]);

    if (result.isLeft()) {
      return left(new Error(concatenateMessages(result.value)));
    }
  }
}
