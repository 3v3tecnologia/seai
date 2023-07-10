import { UserModuleAccessErrors } from "./../../../src/domain/entities/user/errors/invalid-user-permissions";
import { InvalidEmailError } from "../../../src/domain/entities/user/errors/invalid-email";

import { Email } from "../../../src/domain/entities/user/email";
import { User } from "../../../src/domain/entities/user/user";
import { SystemModules } from "../../../src/domain/entities/user/user-modules-access";

// npx jest user.spec.ts
describe("#User entity", () => {
  describe("Register a new user", () => {
    test("should not create a user with invalid e-mail", () => {
      const emailOrError = Email.create("test#gmail.com");

      if (emailOrError.isLeft()) {
        expect(emailOrError.value.message).toBe(
          "O email test#gmail.com é inválido."
        );
      }
    });

    test("should not create a basic user with user manager permission", () => {
      const modulesOrError = SystemModules.create({
        news_manager: {
          id: 1,
          read: true,
          write: false,
        },
        registers: {
          id: 2,
          read: true,
          write: false,
        },
        users_manager: {
          id: 3,
          read: true,
          write: false,
        },
      });

      const emailOrError = Email.create("test@gmail.com");

      const email = emailOrError.value as Email;

      const modules = modulesOrError.value as SystemModules;

      const userOrError = User.create({
        email: email,
        type: "standard",
        modulesAccess: modules,
      });

      const error =
        userOrError.value as UserModuleAccessErrors.InvalidBasicUserPermissionsError;

      expect(error.message).toBe(
        "Para usuário básico, não deve haver permissão para gerenciar usuários."
      );
      expect(error).toBeInstanceOf(
        UserModuleAccessErrors.InvalidBasicUserPermissionsError
      );
    });
    test("should not create a admin user without all permissions equal true", () => {
      const modulesOrError = SystemModules.create({
        news_manager: {
          id: 1,
          read: true,
          write: false,
        },
        registers: {
          id: 2,
          read: true,
          write: false,
        },
        users_manager: {
          id: 3,
          read: true,
          write: false,
        },
      });

      const emailOrError = Email.create("test@gmail.com");

      const email = emailOrError.value as Email;

      const modules = modulesOrError.value as SystemModules;

      const userOrError = User.create({
        email: email,
        type: "admin",
        modulesAccess: modules,
      });

      const error =
        userOrError.value as UserModuleAccessErrors.InvalidUserAdminPermissionsError;

      expect(error.message).toBe(
        "Para usuário administrador, é necessário definir todas as permissões."
      );
      expect(error).toBeInstanceOf(
        UserModuleAccessErrors.InvalidUserAdminPermissionsError
      );
    });
  });

  describe("Create user profile", () => {
    test.todo("should not create a user with invalid e-mail");
    test.todo(
      "should not create a user with password not matching with confirmed password"
    );
    test.todo("should not create a user with invalid login");
    test.todo("should not create a user with invalid name");
  });
});
