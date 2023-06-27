export type TokenPayload = {
  accountId: number;
};

export type TokenResponse = {
  sub: string;
  exp?: number;
  iat?: number;
};
export interface TokenProvider {
  sign(payload: TokenPayload, expires?: string): Promise<string>;
  verify(token: string): Promise<TokenResponse>;
}
