export interface FetchUserAccountByTokenUseCaseProtocol {
  load: (
    accessToken: string,
    role?: string
  ) => Promise<FetchUserAccountByToken.Result | null>;
}

export namespace FetchUserAccountByToken {
  export type Result = {
    id: string;
  };
}
