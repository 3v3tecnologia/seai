import { Either, left, right } from "../../../../shared/Either";
import { Notification } from "../../../../shared/notification/notification";
import { Email } from "../../lib/model/email";
import { UserLogin } from "../../lib/model/login";
import { UserName } from "../../lib/model/name";
import { UserPassword } from "../../lib/model/userPassword";

export const IRRIGATION_USER_TYPE = "irrigant";

interface IrrigationUserProps {
  name?: UserName | null;
  login?: UserLogin | null;
  email: Email;
  password?: UserPassword | null;
}

export class IrrigationUser {
  private readonly _id: number | null;
  private _name: UserName | null;
  private _login: UserLogin | null;
  private _email: Email;
  private _password: UserPassword | null;

  private constructor(props: IrrigationUserProps, id?: number) {
    this._id = id || null;
    this._email = props.email;
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

  static create(
    props: {
      email: string;
      name?: string | null;
      login?: string | null;
      password?: string;
      confirmPassword?: string;
    },
    id?: number
  ): Either<Error, IrrigationUser> {
    const errors = new Notification();

    const emailOrError = Email.create(props.email);

    if (emailOrError.isLeft()) {
      errors.addError(emailOrError.value);
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
      new IrrigationUser(
        {
          email: emailOrError.value as Email,
          login,
          password,
          name,
        },
        id
      )
    );
  }
}
