import { User } from "../../../../domain/entities/user/user";
import { UserPassword } from "../../../../domain/entities/user/userPassword";

export namespace AccountRepository {
  export type system_modules_permissions = {
    news_manager: {
      read: boolean;
      write: boolean;
    };
    registers: {
      read: boolean;
      write: boolean;
    };
    users_manager: {
      read: boolean;
      write: boolean;
    };
  };
}

export class AccountRepository {
  async add(data: {
    email: string;
    type: "admin" | "basic";
    modules: AccountRepository.system_modules_permissions;
  }): Promise<boolean> {
    return true;
  }

  async loadAll(): Promise<Array<User>> {
    return [];
  }

  async update(data: {
    id: number;
    email: string;
    name: string;
    login: string;
    password: string;
  }): Promise<boolean> {
    return true;
  }

  async loadByEmail(email: string): Promise<User | null> {
    const user = User.create(
      {
        email: "davispenha@gmail.com",
        type: "admin",
      },
      1
    );
    return user.value;
  }

  async loadByLogin(login: string): Promise<User | null> {
    const user = User.create({
      email: "davisp@gmail.com",
      type: "admin",
      password: "123132",
    });
    return user.value;
  }

  async deleteById(id: number): Promise<boolean> {
    return true;
  }

  async loadById(id: number): Promise<User | null> {
    const user = User.create(
      {
        email: "davisp@gmail.com",
        type: "admin",
        password: "123132",
        login: "davi",
        name: "davi",
      },
      1
    );
    return user.value;
  }

  async checkByEmail(email: string): Promise<boolean> {
    return false;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {}

  async loadByToken(token: string, role?: string): Promise<any> {
    return {
      id: 1,
      user: "Davi",
      role: "admin",
    };
  }
}
