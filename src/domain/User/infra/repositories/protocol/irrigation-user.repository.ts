import { Optional } from "../../../../../shared/optional";
import { UserStatus } from "../../../core/model/status";
import { IGetRegisteredUserRepository, RegisteredUser } from "./user-repository";

export type IrrigationUserProps = {
  id: number;
  name: string;
  code: string;
  status: "pending" | "registered";
  login: string;
  email: string;
  type: string;
  password?: string;
  updatedAt?: string;
  createdAt?: string;
};

export interface IrrigationUserRepositoryProtocol extends IGetRegisteredUserRepository {
  add(user: {
    code: string;
    status?: string;
    email: string;
    login?: string;
    name?: string;
    password?: string;
  }): Promise<number | null>;
  checkIfNameAlreadyExists(name: string): Promise<boolean>;
  updateUserStatus(user_id: number, status: string): Promise<void>;
  update(user: {
    id?: number;
    code?: string;
    email?: string | null;
    name: string | null;
    login: string | null;
    password?: string | null;
  }): Promise<boolean>;
  updateUserPassword(user_id: number, password: string): Promise<void>;
  deleteById(id_user: number): Promise<boolean>;
  deleteByEmail(email: string): Promise<boolean>;
  getRegisteredUserByLogin(
    email: string,
  ): Promise<{ status: string, password: string, name: string, id: number } | null>;
  getRegisteredUserByEmail(
    email: string,
  ): Promise<{ status: string, password: string, name: string, id: number } | null>
  getById(
    id_user: number
  ): Promise<Required<
    Optional<IrrigationUserProps, "id" | "name" | "code" | "status" | "login">
  > | null>;
  getByEmail(
    email: string,
    status?: UserStatus
  ): Promise<IrrigationUserProps | null>;
  getByLogin(
    login: string,
    status?: UserStatus
  ): Promise<IrrigationUserProps | null>;
  getRegisteredUserByEmail(
    email: string,
  ): Promise<RegisteredUser | null>;
  getRegisteredUserByLogin(
    login: string,
  ): Promise<RegisteredUser | null>;
  getUserById(
    id_user: number
  ): Promise<Optional<
    IrrigationUserProps,
    "id" | "name" | "code" | "status" | "login"
  > | null>;
  getUserByCode(code: string, status?: UserStatus): Promise<IrrigationUserProps | null>;
  checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  checkIfLoginAlreadyExists(login: string): Promise<boolean>;
}
