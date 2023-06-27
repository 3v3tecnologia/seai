import { Email } from "./email";
import { InvalidEmailError } from "./errors/invalid-email";
interface UserProps {
  name?: string;
  login?: string;
  email: string;
  password?: string | null;
  type: "admin" | "standart";
  created_at?: Date;
  updated_at?: Date;
}

interface UserParams {
  name?: string;
  login?: string;
  email: string;
  password?: string;
  type: "admin" | "standart";
  created_at?: Date;
  updated_at?: Date;
}

type Message = {
  isError: boolean;
  value?: any;
};

export class User {
  public readonly name: string | null;
  public readonly login: string | null;
  public email: string;
  public password: string | null;
  public readonly type: "admin" | "standart";
  public created_at?: Date;
  public updated_at?: Date;
  private readonly _id: number | undefined;

  private constructor(props: UserProps, id?: number) {
    this._id = id;
    this.email = props.email;
    this.type = props.type;

    this.name = props.name || null;
    this.login = props.login || null;
    this.password = props.password || null;
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
    const user = new User({ ...props, email: props.email }, id);

    return {
      isError: false,
      value: user,
    };
  }
}
