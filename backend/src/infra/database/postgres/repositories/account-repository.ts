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
export interface ModulesResponse {
  id: number;
  name: string;
}
export namespace AccountRepository {
  export type system_modules_permissions = {
    news_manager: {
      id?: number;
      read: boolean;
      write: boolean;
    };
    registers: {
      id?: number;
      read: boolean;
      write: boolean;
    };
    users_manager: {
      id?: number;
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
      .returning("Id")
      .into("User");

    const user_id = id.length && id[0].Id;

    await connection
      .insert({
        Fk_User: user_id,
        Fk_Module: data.modules.news_manager.id,
        Read: data.modules.news_manager.read,
        Write: data.modules.news_manager.write,
      })
      .into("User_Access");

    await connection
      .insert({
        Fk_User: user_id,
        Fk_Module: data.modules.registers.id,
        Read: data.modules.registers.read,
        Write: data.modules.registers.write,
      })
      .into("User_Access");

    await connection
      .insert({
        Fk_User: user_id,
        Fk_Module: data.modules.users_manager.id,
        Read: data.modules.users_manager.read,
        Write: data.modules.users_manager.write,
      })
      .into("User_Access");

    return true;
  }

  async loadModules(): Promise<Array<ModulesResponse> | null> {
    const modules = await connection.select("*").from("Module");

    console.log("loadAllModules = ", modules);

    if (!modules) {
      return null;
    }
    return modules.map((module) => {
      return {
        id: module.Id,
        name: module.Name,
      };
    });
  }
  async loadUserModules(
    id_user: number
  ): Promise<AccountRepository.system_modules_permissions | null> {
    const modules = await connection
      .select("*")
      .where({ Fk_User: id_user })
      .from("User_Access")
      .innerJoin("Module", "Module.Id", "User_Access.Fk_Module");

    if (!modules) {
      return null;
    }

    const mods = {} as AccountRepository.system_modules_permissions;

    modules.forEach((module) => {
      Object.assign(mods, {
        [module.Name]: {
          id: module.Id,
          read: module.Read,
          write: module.Write,
        },
      });
    });

    return mods;
  }
  async loadUserModulesByName(
    id_user: number,
    name: string
  ): Promise<{
    id?: number;
    read: boolean;
    write: boolean;
  } | null> {
    const module = await connection
      .select("*")
      .where({ Fk_User: id_user })
      .andWhere({ Name: name })
      .from("User_Access")
      .innerJoin("Module", "Module.Id", "User_Access.Fk_Module")
      .first();

    if (!module) {
      return null;
    }

    const mods = { id: module.Id, read: module.Read, write: module.Write };

    return mods;
  }

  async loadAll(): Promise<Array<UserResponse> | null> {
    const users = await connection.select("*").from("User");

    if (!users) {
      return null;
    }
    return users.map((user) => {
      return {
        id: user.Id,
        name: user.Name,
        login: user.Login,
        email: user.Email,
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
    const rows = await connection("User").where({ Id: data.id }).update({
      Email: data.email,
      Name: data.name,
      Login: data.login,
      Password: data.password,
    });

    return rows > 0;
  }

  async loadByEmail(email: string): Promise<UserResponse | null> {
    const user = await connection
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

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
    await connection("User").where("Id", id).del();
    return true;
  }

  async loadById(id: number): Promise<UserResponse | null> {
    const user = await connection
      .select("*")
      .from("User")
      .where({ Id: id })
      .first();

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
