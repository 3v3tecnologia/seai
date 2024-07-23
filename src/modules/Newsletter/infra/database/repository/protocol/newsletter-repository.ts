import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../../domain/use-cases/helpers/pagination";
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

export namespace ContentRepositoryDTO {
  export namespace GetAll {
    export type Request = {
      only_sent: boolean;
      title?: string;
    } & IPaginationInput;

    export type Response = Promise<IOutputWithPagination<
      Required<Content>
    > | null>;
  }

  export namespace Create {
    export type Request = {
      Title: string;
      Description: string | null;
      Data: any;
      SendDate?: string;
      LocationName?: string;
    };

    export type Response = Promise<number>;
  }

  export namespace Delete {
    export type Request = {
      Id: number;
    };
    export type Response = Promise<void>;
  }

  export namespace Update {
    export type Request = {
      Id: number;
      Title: string;
      Description: string | null;
      Data: any;
      LocationName?: string;
      SendDate?: string;
    };

    export type Response = Promise<void>;
  }

  export namespace GetById {
    export type Request = {
      Id: number;
    };

    export type Response = Promise<Content | null>;
  }
}

export namespace SubscriberRepositoryDTO {
  export namespace GetAll {
    export type Request = { name?: string; email?: string } & IPaginationInput;
    export type Response = Promise<IOutputWithPagination<Subscriber>>;
  }

  export namespace Create {
    export type Request = {
      Email: string;
      Name: string;
      Code: string;
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
      Name: string;
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
    request: ContentRepositoryDTO.Create.Request
  ): ContentRepositoryDTO.Create.Response;
  update(
    request: ContentRepositoryDTO.Update.Request
  ): ContentRepositoryDTO.Update.Response;
  delete(
    request: ContentRepositoryDTO.Delete.Request
  ): ContentRepositoryDTO.Delete.Response;
  getById(
    request: ContentRepositoryDTO.GetById.Request
  ): ContentRepositoryDTO.GetById.Response;
  getAll(
    request: ContentRepositoryDTO.GetAll.Request
  ): ContentRepositoryDTO.GetAll.Response;
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
