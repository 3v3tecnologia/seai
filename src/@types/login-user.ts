export type LoginUserAccount = {
  accountId: number;
};

export type UserOperationControllerDTO = {
  Operation: string;
} & LoginUserAccount;
