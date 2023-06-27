import {
  ITokenRepository,
  IUserToken,
} from "../../../../domain/use-cases/ports/user-token-repository";

export class UserTokenRepository implements ITokenRepository {
  private repository: any;

  constructor() {
    this.repository = "";
  }
  async create({
    expires_date,
    user_id,
    token,
  }: IUserToken): Promise<IUserToken> {
    console.log("token === ", token);
    return {
      user_id: 1,
      expires_date: new Date(),
      token,
      created_at: new Date(),
    };
  }
  async findByUserIdAndToken(
    user_id: number,
    token: string
  ): Promise<IUserToken> {
    return {
      user_id: 1,
      token,
      expires_date: new Date(),
      created_at: new Date(),
    };
  }
  async deleteTokenById(id: number): Promise<void> {}
  async findByToken(token: string): Promise<IUserToken> {
    return {
      user_id: 1,
      token,
      expires_date: new Date(),
      created_at: new Date(),
    };
  }
}
