import { InvalidEmailError } from "../../../src/domain/entities/user/errors/invalid-email";

import { User } from "../../../src/domain/entities/user/user";

// describe("#User entity", () => {
//   test("should not create a user with invalid e-mail", () => {
//     const email = "davispenha#gmail.com";
//     const userOrError = User.create({
//       email,
//       type: "admin",
//     });

//     expect(userOrError).toEqual({
//       isError: true,
//       value: new InvalidEmailError(email),
//     });
//   });
// });
