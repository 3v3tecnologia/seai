import {
  AccountRepository,
  UserResponse,
} from "../../../../infra/database/postgres/repositories/account-repository";
import { Either, right } from "../../../../shared/Either";
import { User } from "../../../entities/user/user";

export class GetUsers {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }
  async execute(): Promise<Either<Error, Array<UserResponse> | null>> {
    const users = await this.accountRepository.loadAll();
    return right(users);
  }
}
