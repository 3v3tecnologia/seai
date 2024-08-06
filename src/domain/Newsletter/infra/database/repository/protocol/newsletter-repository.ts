import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../../../Logs/protocols/logger";
import { Content } from "../../../../model/content";
import { Sender } from "../../../../model/sender";
import { Subscriber } from "../../../../model/subscriber";

export namespace NewsletterSenderRepositoryDTO {
  export namespace Create {
    export type Request = {
      Email: string;
      Organ: string;
    };
    export type Response = Promise<number>;
  }

  export namespace Update {
    export type Request = {
      Id: number;
      Email: string;
      Organ: string;
    };
    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      Id: number;
    };
    export type Response = Promise<void>;
  }

  export namespace GetById {
    export type Request = {
      Id: number;
    };
    export type Response = Promise<Required<Sender> | null>;
  }

  export namespace GetAll {
    export type Request = IPaginationInput;
    export type Response = Promise<IOutputWithPagination<Required<Sender>>>;
  }
}

export namespace SubscriberRepositoryDTO {
  export namespace GetAll {
    export type Request = { email?: string } & IPaginationInput;
    export type Response = Promise<IOutputWithPagination<Subscriber>>;
  }

  export namespace Create {
    export type Request = {
      Email: string;
      Code: string;
      Status?: "pending" | "confirmed";
    };
    export type Response = Promise<number>;
  }

  export namespace Delete {
    export type Request = {
      Email: string;
    };
    export type Response = Promise<void>;
  }

  export namespace Update {
    export type Request = {
      Id: number;
      Email: string;
    };
    export type Response = Promise<void>;
  }

  export namespace GetByEmail {
    export type Request = {
      Email: string;
    };
    export type Response = Promise<Required<Subscriber> | null>;
  }
}

export interface SenderRepositoryProtocol {
  create(
    request: NewsletterSenderRepositoryDTO.Create.Request
  ): NewsletterSenderRepositoryDTO.Create.Response;
  update(
    request: NewsletterSenderRepositoryDTO.Update.Request
  ): NewsletterSenderRepositoryDTO.Update.Response;
  delete(
    request: NewsletterSenderRepositoryDTO.Delete.Request
  ): NewsletterSenderRepositoryDTO.Delete.Response;
  getById(
    request: NewsletterSenderRepositoryDTO.GetById.Request
  ): NewsletterSenderRepositoryDTO.GetById.Response;
  getAll(
    request: NewsletterSenderRepositoryDTO.GetAll.Request
  ): NewsletterSenderRepositoryDTO.GetAll.Response;
}

export interface NewsletterSubscriberRepositoryProtocol {
  create(
    request: SubscriberRepositoryDTO.Create.Request
  ): SubscriberRepositoryDTO.Create.Response;
  update(
    request: SubscriberRepositoryDTO.Update.Request
  ): SubscriberRepositoryDTO.Update.Response;
  delete(
    request: SubscriberRepositoryDTO.Delete.Request
  ): SubscriberRepositoryDTO.Delete.Response;
  deleteByCode(code: string): Promise<void>;
  getByEmail(
    request: SubscriberRepositoryDTO.GetByEmail.Request
  ): SubscriberRepositoryDTO.GetByEmail.Response;
  getReceiversEmails(): Promise<Array<string> | null>;
  getAll(
    request: SubscriberRepositoryDTO.GetAll.Request
  ): SubscriberRepositoryDTO.GetAll.Response;
  getByCode(
    code: string,
    status: "confirmed" | "pending"
  ): Promise<Required<Subscriber> | null>;
  confirmSubscriber(code: string): Promise<void>;
}

export interface NewsRepositoryProtocol {
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
    params: {
      only_sent: boolean;
      title?: string;
      sendDate?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<Required<Content>> | null>;
  getNewsById(id: number): Promise<{
    Id: number;
    Title: string;
    Description: string;
    Data: string;
    CreatedAt: string;
    UpdatedAt: string;
    SendDate: string;
  } | null>;
  updateSendAt(id: number): Promise<void>;
}
