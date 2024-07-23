import { Either, left, right } from "../../../../shared/Either";
import { UnmatchedPasswordError } from "../services/authentication/errors";
import { PasswordErrors } from "./errors/invalid-password";

interface IUserPasswordProps {
  value: string;
  confirm?: string | null;
  isHashed?: boolean;
}

export class UserPassword {
  public static minLength: number = 6;
  public static saltRounds: number = 10;

  private _value: string;
  private isHashed: boolean;

  private constructor(props: IUserPasswordProps) {
    this._value = props.value;
    this.isHashed = props.isHashed || false;
  }

  get value(): string {
    return this._value;
  }

  public isAlreadyHashed(): boolean {
    return this.isHashed;
  }

  public async comparePlainPassword(
    plaintextPassword: string
  ): Promise<boolean> {
    return this._value === plaintextPassword;
  }

  public static create(
    props: IUserPasswordProps
  ): Either<
    | PasswordErrors.EmptyPasswordError
    | PasswordErrors.PasswordLengthError
    | PasswordErrors.PasswordWithoutNumbersError
    | PasswordErrors.UnmatchedPasswordError,
    UserPassword
  > {
    if (!props.value || props.value.length === 0) {
      return left(new PasswordErrors.EmptyPasswordError());
    }
    // Estiver criando um usuário com senha não encriptografada
    if (!props.isHashed) {
      if (tooShort(props.value)) {
        return left(
          new PasswordErrors.PasswordLengthError(UserPassword.minLength)
        );
      }
      if (noNumberIn(props.value)) {
        return left(new PasswordErrors.PasswordWithoutNumbersError());
      }
      if (
        Reflect.has(props, "confirm") === false ||
        props.confirm === null ||
        props.confirm === undefined
      ) {
        return left(new Error("Confirm password is required"));
      }
      // TODO: Check if password has same values
      if (props.value.length !== props.confirm?.length) {
        return left(new UnmatchedPasswordError());
      }
    }

    return right(
      new UserPassword({
        value: props.value,
        isHashed: !!props.isHashed === true,
      })
    );
  }
}

function isMatchPassword(password: string, confirm: string): boolean {
  return password.length < UserPassword.minLength;
}

function tooShort(password: string): boolean {
  return password.length < UserPassword.minLength;
}

function noNumberIn(password: string) {
  return !/\d/.test(password);
}
