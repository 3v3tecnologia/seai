export type Content = {
  Id?: number;
  Title: string;
  // Author: {
  //   Id: number;
  //   Email: string;
  //   Organ: string;
  // };
  SendDate?: string;
  SentAt?: string | null;
  Description: string | null;
  // LocationName: string;
  Data?: any;
  CreatedAt?: string;
  UpdatedAt?: string;
};
