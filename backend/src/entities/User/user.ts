import { Email } from "./email";

enum UserTypes {
  admin = "admin",
  standart = "standart",
}

interface UserProps {
  name: string;
  login: string;
  email: Email;
  password: string;
  type: "admin" | "stadart";
  created_at?: Date;
  updated_at?: Date;
}

interface UserParams {
  name: string;
  login: string;
  email: string;
  password: string;
  type: "admin" | "stadart";
  created_at?: Date;
  updated_at?: Date;
}

export class User {
  public readonly name: string;
  public readonly login: string;
  public readonly email: Email;
  public readonly password: string;
  public readonly type: "admin" | "stadart";
  public created_at?: Date;
  public updated_at?: Date;
  private readonly _id: number | undefined;

  constructor(props: UserProps, id?: number) {
    this.name = props.name;
    this.login = props.login;
    this.email = props.email;
    this.password = props.password;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.type = props.type;
    this._id = id;
  }

  private setCreatedDate() {
    this.created_at = new Date();
    // this._props.created_at = Number(
    //   (Date.now().valueOf() / 1000).toPrecision(10)
    // );
  }
  private setUpdatedDate() {
    this.updated_at = new Date();
  }

  static create(props: UserParams, id?: number) {
    const emailOrError = Email.create(props.email);

    if (emailOrError.isError) {
      return emailOrError;
    }

    return new User(
      {
        email: emailOrError.value,
        login: props.login,
        name: props.name,
        password: props.password,
        type: props.type,
      },
      id
    );
  }
}
