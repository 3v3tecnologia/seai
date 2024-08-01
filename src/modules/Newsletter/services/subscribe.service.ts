import { Encoder } from "../../../domain/use-cases/_ports/cryptography/encoder";
import { TASK_QUEUES } from "../../../infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { PUBLIC_ASSETS_BASE_URL } from "../../../server/http/config/url";
import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/logger/logger";
import { NewsletterSubscriberRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";

export class SubscribeToNews implements SubscribeToNewsUseCaseProtocol.UseCase {
  private repository: NewsletterSubscriberRepositoryProtocol;
  private readonly queueService: TaskSchedulerProviderProtocol;
  private readonly encoder: Encoder;

  constructor(
    repository: NewsletterSubscriberRepositoryProtocol,
    queueService: TaskSchedulerProviderProtocol,
    encoder: Encoder
  ) {
    this.repository = repository;
    this.queueService = queueService;
    this.encoder = encoder;
  }
  async execute(
    request: SubscribeToNewsUseCaseProtocol.Request
  ): SubscribeToNewsUseCaseProtocol.Response {
    const AlreadyExistsSubscriber = await this.repository.getByEmail({
      Email: request.Email,
    });

    if (AlreadyExistsSubscriber !== null) {
      return left(new Error("Usuário já cadastrado."));
    }

    const userCode = await this.encoder.hashInPbkdf2(
      request.Email,
      100,
      10,
      "sha512"
    );

    const data = {
      Email: request.Email,
      Code: userCode as string,
    };

    if (request.Status) {
      Object.assign(data, {
        Status: request.Status,
      });
    }

    const subscriberId = await this.repository.create(data);

    if (subscriberId) {
      await this.queueService.send(TASK_QUEUES.USER_ACCOUNT_NOTIFICATION, {
        email: request.Email,
        redirect_url: `${PUBLIC_ASSETS_BASE_URL}/newsletter/subscriber/${userCode}/confirmation`,
        action: "newsletter-subscription",
      });
    }

    return right(
      "Aguardando o envio do email de confirmação de cadastro nas notícias."
    );
  }
}

export namespace SubscribeToNewsUseCaseProtocol {
  export type Request = {
    Email: string;
    Status?: "pending" | "confirmed";
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
