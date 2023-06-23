export type TokenPayload = {
  accountId: number;
};

export interface TokenProvider {
  sign(payload: TokenPayload, expires?: string): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
