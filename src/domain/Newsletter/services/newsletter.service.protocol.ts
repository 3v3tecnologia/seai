import { Either } from "../../../shared/Either";
import { AuditableInput, PaginatedInput } from "../../../shared/utils/command";
import { IOutputWithPagination, IPaginationInput } from "../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../Logs/protocols/logger";
import { Content } from "../model/content";

export type CreateNewsInput = {
  Title: string;
  Description: string | null;
  Data: any;
  SendDate: string;
  LocationName?: string;
  accountId: number;
}

export interface NewsletterServiceProtocol {
  create(input: AuditableInput<{
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
    LocationName?: string;
    accountId: number;
  }>): Promise<Either<Error, number>>
  delete(input: AuditableInput<{
    id: number
  }>): Promise<Either<Error, string>>
  update(
    input: AuditableInput<{
      Title: string;
      Description: string | null;
      Data: any;
      SendDate: string;
    }>
  ): Promise<Either<Error, string>>
  markAsSent(
    sendDate: string
  ): Promise<Either<Error, string>>
  getUnsentBySendDate(sendDate: string): Promise<Either<Error, Array<Pick<Content, 'Title' | 'Description' | 'Id'>>>>
  getOnlySent(request: PaginatedInput<{
    title?: string;
    sendDate?: string;
  }>): Promise<
    Either<Error, IOutputWithPagination<Required<Content>>>
  >
  getAll(request: PaginatedInput<{
    title?: string;
    sendDate?: string;
  }>): Promise<
    Either<Error, IOutputWithPagination<Required<Content>>>
  >
  getSubscribers(): Promise<Either<Error, Array<{
    Email: string;
    Code: string;
  }> | null>>
  unsubscribe(email: string): Promise<Either<Error, void>>
  subscribe(email: string): Promise<Either<Error, void>>
}
