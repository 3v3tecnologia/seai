import { Optional } from "../../../../../../shared/optional";

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

export interface IrrigationUserRepositoryProtocol {
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
  getById(
    id_user: number
  ): Promise<Required<
    Optional<IrrigationUserProps, "id" | "name" | "code" | "status" | "login">
  > | null>;
  getByEmail(email: string): Promise<IrrigationUserProps | null>;
  getByLogin(login: string): Promise<IrrigationUserProps | null>;
  getUserById(
    id_user: number
  ): Promise<Optional<
    IrrigationUserProps,
    "id" | "name" | "code" | "status" | "login"
  > | null>;
  getUserByCode(code: string): Promise<IrrigationUserProps | null>;
  checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  checkIfLoginAlreadyExists(login: string): Promise<boolean>;
}
