import bcrypt from "bcrypt";
import { InvalidPasswordError } from "./errors/invalid-password";

interface IUserPasswordProps {
  value: string;
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

  public value(): string {
    return this._value;
  }

  public static isAppropriedLength(password: string): boolean {
    return password.length >= UserPassword.minLength;
  }

  public isAlreadyHashed(): boolean {
    return this.isHashed;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(UserPassword.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  public async getHashedPassword(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this._value;
    }

    return await this.hashPassword(this._value);
  }

  public async compareHashedPassword(
    plaintextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  }

  public async comparePlainPassword(
    plaintextPassword: string
  ): Promise<boolean> {
    return this._value === plaintextPassword;
  }

  public static create(props: IUserPasswordProps) {
    if (!props.value || props.value.length === 0) {
      return {
        isError: true,
        value: new InvalidPasswordError(),
      };
    }
    // Estiver criando um usuário com senha não encriptografada
    if (!props.isHashed) {
      if (!UserPassword.isAppropriedLength(props.value)) {
        return {
          isError: true,
          value: new InvalidPasswordError(),
        };
      }
    }

    return {
      isError: false,
      value: new UserPassword({
        value: props.value,
        isHashed: !!props.isHashed === true,
      }),
    };
  }
}
