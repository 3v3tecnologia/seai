import { UserOperationControllerDTO } from "../../../../@types/login-user";
import { IPaginationInput } from "../../../../shared/utils/pagination";

export type CreateNewsletterRequest = {
  accountId: number;
  Title: string;
  Description: string | null;
  Data: any;
  SendDate: string;
}

export type UpdateNewsletterRequest = {
  accountId: number;
  id: number;
  Title: string;
  Description: string | null;
  Data: any;
  SendDate: string;
} & UserOperationControllerDTO

export type UpdateNewsletterSendAtRequest = {
  accountId: number;
  id: number;
}

export type DeleteNewsletterRequest = {
  id: number;
} & UserOperationControllerDTO

export type GetOnlySentNewsletterRequest = {
  title?: string;
  sendDate?: string;
  // start?: string;
  // end?: string | null;
} & IPaginationInput

export type GetAllNewslettersRequest = {
  title?: string;
  sendDate?: string;
  // start?: string;
  // end?: string | null;
} & IPaginationInput
