import { User } from "../../../src/domain/entities/user/user";

// npx jest user.spec.ts
describe("#User entity", () => {
  describe("Register a new user", () => {
    test("should not create a user with invalid e-mail", () => {
      const email = "test#gmail";

      const userOrError = User.create({
        email,
        type: "standard",
        modulesAccess: {
          news: {
            id: 1,
            read: true,
            write: false,
          },
          register: {
            id: 2,
            read: true,
            write: false,
          },
          user: {
            id: 3,
            read: false,
            write: false,
          },
        },
      });

      const result = userOrError.value as Error;

      expect(result.message).toEqual(`O email ${email} é inválido.`);
    });

    test("should not create a basic user with user manager permission", () => {
      const userOrError = User.create({
        email: "test@gmail.com",
        type: "standard",
        modulesAccess: {
          news: {
            id: 1,
            read: true,
            write: false,
          },
          register: {
            id: 2,
            read: true,
            write: false,
          },
          user: {
            id: 3,
            read: true,
            write: false,
          },
        },
      });

      const result = userOrError.value as Error;

      expect(result.message).toEqual(
        "Para usuário básico, não deve haver permissão para gerenciar usuários."
      );
    });

    test("should not create a admin user without all permissions equal true", () => {
      const userOrError = User.create({
        email: "test@gmail.com",
        type: "admin",
        modulesAccess: {
          news: {
            id: 1,
            read: true,
            write: false,
          },
          register: {
            id: 2,
            read: true,
            write: false,
          },
          user: {
            id: 3,
            read: true,
            write: false,
          },
        },
      });

      const result = userOrError.value as Error;

      expect(result.message).toEqual(
        "Para usuário administrador, é necessário definir todas as permissões."
      );
    });
  });

  describe("Create user profile", () => {
    // test.todo(
    //   "should not create a user with password not matching with confirmed password"
    // );
    test("should not create a user with invalid login", () => {
      const userOrError = User.create({
        email: "test@gmail.com",
        type: "standard",
        login:
          "testasdasdsagdashdgdfahsgdafhgfsdhgafsghdfshdfhgsasdasddasdasdassd",
        modulesAccess: {
          news: {
            id: 1,
            read: true,
            write: false,
          },
          register: {
            id: 2,
            read: true,
            write: false,
          },
          user: {
            id: 3,
            read: false,
            write: false,
          },
        },
      });

      const result = userOrError.value as Error;

      expect(result.message).toEqual(
        "Login inválido, não deve ser vazio ou nulo e não deve ser maior do que a quantidade de caracteres permitido."
      );
    });
    test("should not create a user with invalid name", () => {
      const userOrError = User.create({
        email: "test@gmail.com",
        name: "",
        type: "standard",
        modulesAccess: {
          news: {
            id: 1,
            read: true,
            write: false,
          },
          register: {
            id: 2,
            read: true,
            write: false,
          },
          user: {
            id: 3,
            read: false,
            write: false,
          },
        },
      });

      const result = userOrError.value as Error;

      expect(result.message).toEqual("Nome não deve ser vazio ou nulo");
    });
  });
});
