import { AuditableInput, PaginatedInput } from './../../../shared/utils/command';
import { Either, left, right } from "../../../shared/Either";
import { TASK_QUEUES } from "../../../shared/infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../shared/infra/queueProvider/protocol/jog-scheduler.protocol";
import { Encoder } from "../../../shared/ports/encoder";
import { IOutputWithPagination, IPaginationInput } from "../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../Logs/protocols/logger";
import { NewsletterRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { Content, validateContentSize } from "../model/content";
import { NewsletterServiceProtocol } from "./newsletter.service.protocol";




export class NewsletterService implements NewsletterServiceProtocol {
  constructor(
    private repository: NewsletterRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol,
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

    const sendDate = new Date(SendDate);

    // const hasValidSendDateOrError = validateSendDate(sendDate);

    // if (hasValidSendDateOrError.isLeft()) {
    //   return left(hasValidSendDateOrError.value);
    // }

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

    // E se o sistema de jobs estiver indisponível? Como o sistema deve se comportar?
    await this.queueProvider.send(
      TASK_QUEUES.NEWSLETTER,
      {
        id: newsId,
        title: Title,
        description: Description,
        content: Data,
      },
      {
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: sendDate,
        singletonkey: String(newsId),
      }
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

    // delete all jobs related to the news (purge by news id)
    await this.queueProvider.removeByKey(String(id));

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
    const { Id, Data, Description, SendDate, Title } = data

    const hasValidContentSizeOrError = validateContentSize(Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    // const sendDate = new Date(SendDate);

    // const hasValidSendDateOrError = validateSendDate(sendDate);

    // if (hasValidSendDateOrError.isLeft()) {
    //   return left(hasValidSendDateOrError.value);
    // }

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

    await this.queueProvider.removeByKey(String(Id));

    await this.queueProvider.send(
      TASK_QUEUES.NEWSLETTER,
      {
        id: Id,
        title: Title,
        description: Description,
        content: Data,
      },
      {
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: new Date(SendDate),
        singletonkey: String(Id),
      }
    );

    return right(successLog);
  }
  // Mark the news as sent
  async updateSendAt(
    id: number
  ): Promise<Either<Error, string>> {
    const alreadyExistsNews = await this.repository.getById(id);

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    await this.repository.updateSendAt(id);

    const successLog = `Notícia atualizada com sucessso.`;

    return right(successLog);
  }

  async getById(id: number): Promise<Either<Error, Content | null>> {
    const data = await this.repository.getById(id);

    if (data === null) {
      return right(null);
    }

    return right(data);
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

  // Used to send bulk emails
  async getSubscribers(): Promise<Either<Error, Array<{
    Email: string;
    Code: string;
  }> | null>> {
    const data = await this.repository.getReceiversEmails();

    return right(data);
  }

  async subscribe(email: string): Promise<Either<Error, void>> {
    const AlreadyExistsSubscriber = await this.repository.getSubscriberByEmail(email);

    if (AlreadyExistsSubscriber !== null) {
      return left(new Error("Usuário já cadastrado."));
    }

    const userCode = await this.encoder.hashInPbkdf2(
      email,
      100,
      10,
      "sha512"
    );

    await this.repository.subscribe({
      Code: userCode as string,
      Email: email,
      Status: 'confirmed'
    });

    return right()

  }
  async unsubscribe(email: string): Promise<Either<Error, void>> {
    const subscriber = await this.repository.getSubscriberByEmail(email);

    if (subscriber === null) {
      return left(new Error("Email não encontrado"));
    }

    await this.repository.unsubscribe(email);

    return right();
  }
}
