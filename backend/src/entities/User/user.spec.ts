import { InvalidEmailError } from "./errors/invalid-email";
import { User } from "./user";

describe("#User entity", () => {
  test("should not create a user with invalid e-mail", () => {
    const email = "davispenha#gmail.com";
    const userOrError = User.create({
      login: "DaviS",
      name: "Davi Silva",
      email,
      password: "12345667",
      type: "admin",
    });

    expect(userOrError).toEqual({
      isError: true,
      value: new InvalidEmailError(email),
    });
  });
  test.todo("should not create a user with password least than 6 characters");
  test.todo("should not create a user with invalid login name (blank spaces)");
  test.todo(
    "should not create a user with invalid login name (too many characters)"
  );
  test.todo("should not create a user with invalid name (blank spaces)");
  test.todo(
    "should not create a user with invalid  name (too many characters)"
  );
  test.todo("should be able to create password hash when user was created");
});
