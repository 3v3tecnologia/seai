import { Email } from "./email";
import { InvalidEmailError } from "./errors/invalid-email";
import { InvalidLoginError } from "./errors/invalid-login";
import { InvalidPasswordError } from "./errors/invalid-password";
import { UserLogin } from "./login";
import { UserName } from "./name";
import { UserPassword } from "./userPassword";
interface UserProps {
  name?: UserName;
  login?: UserLogin;
  email: Email;
  password?: UserPassword;
  type: "admin" | "stadart";
  created_at?: Date;
  updated_at?: Date;
}

interface UserParams {
  name?: UserName;
  login?: UserLogin;
  email: string;
  password?: UserPassword;
  type: "admin" | "stadart";
  created_at?: Date;
  updated_at?: Date;
}

type Message = {
  isError: boolean;
  value?: any;
};

export class User {
  public readonly name: UserName | null;
  public readonly login: UserLogin | null;
  public readonly email: Email;
  public readonly password: UserPassword | null;
  public readonly type: "admin" | "stadart";
  public created_at?: Date;
  public updated_at?: Date;
  private readonly _id: number | undefined;

  private constructor(props: UserProps, id?: number) {
    this._id = id;
    this.email = props.email;
    this.type = props.type;

    this.name = props.name || null;
    this.login = props.login || null;
    this.password = null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  get id(): number | undefined {
    return this._id;
  }

  static create(props: UserParams, id?: number): Message {
    const emailOrError = Email.create(props.email);

    if (emailOrError.isError) {
      return {
        isError: true,
        value: new InvalidEmailError(props.email),
      };
    }
    const user = new User({ ...props, email: emailOrError.value }, id);

    return {
      isError: false,
      value: user,
    };
  }
}
