import { PaginatedInput } from "../../../../../../shared/utils/command";
import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../../../Logs/core/protocols/logger";
import { Content } from "../../../../core/model/content";
import { Subscriber } from "../../../../core/model/subscriber";



export interface NewsletterRepositoryProtocol {
  create(
    news: {
      Title: string;
      Description: string | null;
      Data: any;
      SendDate?: string;
      LocationName?: string;
    },
    accountId: number
  ): Promise<number>;
  update(
    news: {
      Id: number;
      Title: string;
      Description: string | null;
      Data: any;
      LocationName?: string;
      SendDate?: string;
    },
    operation: UserCommandOperationProps
  ): Promise<void>;
  delete(id: number, operation: UserCommandOperationProps): Promise<void>;
  getById(id: number): Promise<Content | null>;
  getAll(
    params: PaginatedInput<{
      only_sent: boolean;
      title?: string;
      sendDate?: string;
    }>
  ): Promise<IOutputWithPagination<Required<Content>> | null>;
  getUnsetNewsByDate(sendDate: string): Promise<Array<{ Link: string } & Pick<Content, 'Title' | 'Description' | 'Id'>>>
  getNewsById(id: number): Promise<{
    Id: number;
    Title: string;
    Description: string;
    Data: string;
    CreatedAt: string;
    UpdatedAt: string;
    SendDate: string;
  } | null>;
  markAsSent(date: string): Promise<void>
  getReceiversEmails(): Promise<Array<{
    Email: string;
    Code: string;
  }>>
  unsubscribe(
    email: string
  ): Promise<void>
  subscribe(
    request: {
      Email: string;
      Code: string;
      Status?: "pending" | "confirmed";
    }
  ): Promise<number>
  getSubscriberByEmail(
    email: string
  ): Promise<Required<Subscriber> | null>
}
