export interface IUserToken {
  id?: number;
  user_id: number;
  token: string;
  expires_date: Date;
  created_at?: Date;
}

export interface ITokenRepository {
  create({ expires_date, user_id, token }: IUserToken): Promise<IUserToken>;
  findByUserIdAndToken(user_id: number, token: string): Promise<IUserToken>;
  deleteTokenById(id: number): Promise<void>;
  findByToken(token: string): Promise<IUserToken>;
}
