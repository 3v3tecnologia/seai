import { Either, left, right } from "../../../shared/Either";
import { Encoder } from "../../../shared/ports/encoder";
import { IOutputWithPagination } from "../../../shared/utils/pagination";
import { Content, validateContentSize } from "../core/model/content";
import { NewsletterRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { AuditableInput, PaginatedInput } from './../../../shared/utils/command';
import { NewsletterServiceProtocol } from "./newsletter.service.protocol";

export class NewsletterService implements NewsletterServiceProtocol {
  constructor(
    private repository: NewsletterRepositoryProtocol,
    private readonly encoder: Encoder
  ) { }


  async create({ audit, data }: AuditableInput<{
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
    LocationName?: string;
    accountId: number;
  }>): Promise<Either<Error, number>> {
    const { Data, Description, SendDate, Title, accountId, LocationName } = data

    const hasValidContentSizeOrError = validateContentSize(Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    const newsId = await this.repository.create(
      {
        Data,
        Description,
        SendDate,
        Title,
        LocationName,
      },
      accountId
    );


    return right(newsId);
  }


  async delete(input: AuditableInput<{
    id: number
  }>): Promise<Either<Error, string>> {
    const {
      audit,
      data: {
        id
      }
    } = input
    const item = await this.repository.getById(id);

    if (item == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    await this.repository.delete(id, audit);

    const successLog = `Notícia deletada com sucessso.`;

    return right(successLog);
  }

  async update(
    { audit, data }: AuditableInput<{
      Id: number;
      Title: string;
      Description: string | null;
      Data: any;
      SendDate: string
    }>
  ): Promise<Either<Error, string>> {
    const { Id, Data } = data

    const hasValidContentSizeOrError = validateContentSize(Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    const alreadyExistsNews = await this.repository.getById(Id);

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    if (alreadyExistsNews.SentAt) {
      return left(
        new Error(`Notícia é possível editar uma notícia já enviada.`)
      );
    }

    await this.repository.update(data, audit);

    const successLog = `Notícia atualizada com sucessso.`;

    return right(successLog);
  }
  // Mark the news as sent
  async markAsSent(
    sendDate: string
  ): Promise<Either<Error, string>> {
    await this.repository.markAsSent(sendDate);

    return right(`Notícias com data de envio para ${sendDate} atualizadas com sucesso.`);
  }

  async getById(id: number): Promise<Either<Error, Content | null>> {
    const data = await this.repository.getById(id);

    if (data === null) {
      return right(null);
    }

    const { Id, Title, Description, CreatedAt, UpdatedAt, SentAt, SendDate, Data } = data

    return right({ Id, Title, Description, CreatedAt, UpdatedAt, SentAt, SendDate, Data: Data.toString() });
  }

  async getOnlySent(request: PaginatedInput<{
    title?: string;
    sendDate?: string;
  }>): Promise<
    Either<Error, IOutputWithPagination<Required<Content>>>
  > {
    const { data, paginate } = request

    const result = await this.repository.getAll({
      data: {
        only_sent: true,
        ...data,
      },
      paginate
    });

    return right(result);
  }


  async getAll(request: PaginatedInput<{
    title?: string;
    sendDate?: string;
  }>): Promise<
    Either<Error, IOutputWithPagination<Required<Content>>>
  > {
    const { data, paginate } = request

    const result = await this.repository.getAll({
      data: {
        only_sent: false,
        ...data,
      },
      paginate
    });

    return right(result);
  }

  async getUnsentBySendDate(sendDate: string): Promise<Either<Error, Array<Pick<Content, 'Title' | 'Description' | 'Id'>>>> {
    const result = await this.repository.getUnsetNewsByDate(sendDate);

    return right(result);
  }

  // Used to send bulk emails
  async getSubscribers(): Promise<Either<Error, Array<{
    Email: string;
    Code: string;
  }> | null>> {
    const data = await this.repository.getReceiversEmails();

    return right(data);
  }
}
