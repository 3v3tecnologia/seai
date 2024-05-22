import { Either, left, right } from "./Either";

type GuardResponse = string;

interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export function combine(results: any[]) {}

export function againstNullOrUndefined(
  argument: any,
  argumentName: string
): Either<GuardResponse, void> {
  if (argument === null || argument === undefined) {
    return left(`${argumentName} é nulo ou indefinido`);
  } else {
    return right();
  }
}
export function againstNullOrUndefinedBulk(
  args: GuardArgumentCollection
): Either<Array<string>, void> {
  const errors: Array<string> = [];

  for (const arg of args) {
    const result = againstNullOrUndefined(arg.argument, arg.argumentName);
    if (result.isLeft()) {
      errors.push(result.value);
    }
  }

  if (errors.length > 0) {
    return left(errors);
  }

  return right();
}

export function isOneOf(argument: any, type: string): boolean {
  return typeof argument === type;
}

export function checkArgumentsTypesBulk(
  args: Array<{
    argument: any;
    type: string;
    argumentName: string;
  }>
): Either<Array<string>, void> {
  const errors: Array<string> = [];

  for (const arg of args) {
    const result = isOneOf(arg.argument, arg.type);
    if (result === false) {
      errors.push(`${arg.argumentName} não é do tipo ${arg.type}`);
    }
  }

  if (errors.length > 0) {
    return left(errors);
  }

  return right();
}

export function concatenateMessages(msg: Array<string>): string {
  let message = "";

  msg.forEach((error) => {
    message += error + "\n";
  });

  return message;
}
