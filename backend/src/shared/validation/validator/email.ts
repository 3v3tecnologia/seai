import { InvalidEmailError } from "../errors/invalid-email";
import { Validator } from "../ports/validator";

import { Either, left, right } from "../../Either";

export class EmailValidator implements Validator {
  validate(email: string): Either<InvalidEmailError, null> {
    var tester =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) {
      return left(new InvalidEmailError("Emails is empty"));
    }
    if (email.length > 256) {
      return left(
        new InvalidEmailError("Email is greater than 256 characters.")
      );
    }
    if (!tester.test(email)) {
      return left(new InvalidEmailError("Invalid format"));
    }
    var [account, address] = email.split("@");
    if (account.length > 64) {
      return left(new InvalidEmailError("Too big account"));
    }
    var domainParts = address.split(".");
    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    ) {
      return left(new InvalidEmailError("Domain error"));
    }
    return right(null);
  }
}
