import { User } from "../../../../domain/entities/user/user";

import connection from "../connection/knexfile";

export interface UserResponse {
  id?: number;
  name?: string;
  login?: string;
  email: string;
  password?: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}
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
    type: "admin" | "standart";
    modules: AccountRepository.system_modules_permissions;
  }): Promise<boolean> {
    const id = await connection
      .insert({
        Email: data.email,
        Type: data.type,
      })
      .into("User");

    console.log("id ", id);

    // await connection
    //   .insert({
    //     Fk_User: id,
    //     Fk_Module: "",
    //     Permission: "",
    //     Description: "",
    //   })
    //   .into("User_Access");
    return true;
  }

  async loadAll(): Promise<Array<UserResponse> | null> {
    const users = await connection.select("*").from("User");

    console.log("loadAll = ", users);

    if (!users) {
      return null;
    }
    return users.map((user) => {
      return {
        id: user.Id,
        name: user.Name,
        login: user.Login,
        email: user.Email,
        password: user.Password,
        type: user.Type,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
      };
    });
  }

  async update(data: {
    id: number;
    email: string;
    name: string;
    login: string;
    password: string;
  }): Promise<boolean> {
    console.log("UPDATE ", data);
    const rows = await connection("User").where({ Id: data.id }).update({
      Email: data.email,
      Name: data.name,
      Login: data.login,
      Password: data.password,
    });

    console.log("rows ", rows);

    return rows > 0;
  }

  async loadByEmail(email: string): Promise<UserResponse | null> {
    const user = await connection
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

    console.log("loadByEmail = ", user);

    if (!user) {
      return null;
    }

    return {
      id: user.Id,
      name: user.Name,
      login: user.Login,
      email: user.Email,
      password: user.Password,
      type: user.Type,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
  }

  async loadByLogin(login: string): Promise<UserResponse | null> {
    const user = await connection
      .select("*")
      .from("User")
      .where("Login", login)
      .first();

    console.log("loadByLogin = ", user);

    if (!user) {
      return null;
    }

    return {
      id: user.Id,
      name: user.Name,
      login: user.Login,
      email: user.Email,
      password: user.Password,
      type: user.Type,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
  }

  async deleteById(id: number): Promise<boolean> {
    const rows = await connection("User").where("Id", id).del();
    console.log("DELETED ", rows);
    return true;
  }

  async loadById(id: number): Promise<UserResponse | null> {
    const user = await connection
      .select("*")
      .from("User")
      .where("Id", id)
      .first();

    console.log("loadById = ", user);

    if (!user) {
      return null;
    }

    return {
      id: user.Id,
      name: user.Name,
      login: user.Login,
      email: user.Email,
      password: user.Password,
      type: user.Type,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
  }

  async checkByEmail(email: string): Promise<boolean> {
    const user = await connection
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

    return user ? true : false;
  }
}
