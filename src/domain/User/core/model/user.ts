import { Either, left, right } from "../../../../shared/Either";
import { Notification } from "../../../../shared/notification/notification";
import { Email } from "./email";
import { UserLogin } from "./login";
import { UserName } from "./name";

import { SystemModules, SystemModulesProps } from "./user-modules-access";
import { UserPassword } from "./userPassword";

export enum UserTypes {
  ADMIN = "admin",
  STANDARD = "standard",
  IRRIGANT = "irrigant",
}
export type UserType = `${
  | UserTypes.ADMIN
  | UserTypes.STANDARD
  | UserTypes.IRRIGANT}`;

interface UserProps {
  name?: UserName | null;
  login?: UserLogin | null;
  email: Email;
  password?: UserPassword | null;
  modulesAccess?: SystemModules | null;
  type: UserType;
}

export class User {
  private readonly _id: number | null;
  private _name: UserName | null;
  private _login: UserLogin | null;
  private _email: Email;
  private _password: UserPassword | null;
  public type: UserType;
  private readonly _modulesAccess: SystemModules | null;

  private constructor(props: UserProps, id?: number) {
    this._id = id || null;
    this._email = props.email;
    this.type = props.type;
    this._modulesAccess = props.modulesAccess || null;
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

  get access(): SystemModules | null {
    return this._modulesAccess;
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

  static create(
    props: {
      email: string;
      type: UserType;
      name?: string | null;
      login?: string | null;
      password?: string;
      confirmPassword?: string;
      modulesAccess?: SystemModulesProps | null;
    },
    id?: number
  ): Either<Error, User> {
    const errors = new Notification();

    const emailOrError = Email.create(props.email);

    if (emailOrError.isLeft()) {
      errors.addError(emailOrError.value);
    }

    if (
      !props.type ||
      ![
        `${UserTypes.ADMIN}`,
        `${UserTypes.IRRIGANT}`,
        `${UserTypes.STANDARD}`,
      ].includes(props.type)
    ) {
      errors.addError(new Error("Necessário informar o tipo do usuário"));
    }

    let userAccess: SystemModules | null = null;

    if (props.modulesAccess) {
      const accessOrError = SystemModules.create(
        props.modulesAccess,
        props.type
      );

      if (accessOrError.isRight()) {
        userAccess = accessOrError.value as SystemModules;
      } else {
        errors.addError(accessOrError.value);
      }
    }

    const nameOrError =
      Reflect.has(props, "name") && props.name !== null
        ? UserName.create(props.name as string)
        : null;

    if (nameOrError !== null && nameOrError.isLeft()) {
      errors.addError(nameOrError.value);
    }

    const passwordOrError =
      Reflect.has(props, "password") && props.password !== null
        ? UserPassword.create({
            value: props.password as string,
            confirm: Reflect.has(props, "confirmPassword")
              ? props.confirmPassword
              : null,
          })
        : null;

    if (passwordOrError !== null && passwordOrError.isLeft()) {
      errors.addError(passwordOrError.value);
    }

    const loginOrError =
      Reflect.has(props, "login") && props.login !== null
        ? UserLogin.create(props.login as string)
        : null;

    if (loginOrError !== null && loginOrError.isLeft()) {
      errors.addError(loginOrError.value);
    }

    if (errors.hasErrors()) {
      return left(new Error(errors.messages()));
    }

    const password =
      passwordOrError === null
        ? null
        : (passwordOrError?.value as UserPassword);

    const login =
      loginOrError === null ? null : (loginOrError.value as UserLogin);

    const name = nameOrError === null ? null : (nameOrError?.value as UserName);

    return right(
      new User(
        {
          email: emailOrError.value as Email,
          type: props.type,
          login,
          password,
          name,
          modulesAccess: userAccess !== undefined ? userAccess : null,
        },
        id
      )
    );
  }
}
