import { Encoder } from "../../../domain/use-cases/_ports/cryptography/encoder";
import { CreateJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { PUBLIC_ASSETS_BASE_URL } from "../../../server/http/config/url";
import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/logger/logger";
import { NewsletterSubscriberRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";

export class SubscribeToNews implements SubscribeToNewsUseCaseProtocol.UseCase {
  private repository: NewsletterSubscriberRepositoryProtocol;
  private readonly queueService: CreateJobUseCaseProtocol.UseCase;
  private readonly encoder: Encoder;

  constructor(
    repository: NewsletterSubscriberRepositoryProtocol,
    queueService: CreateJobUseCaseProtocol.UseCase,
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
      const scheduledOrError = await this.queueService.execute({
        name: "newsletter-subscriber-notification",
        priority: 3,
        retryDelay: 180,
        retryLimit: 3,
        data: {
          email: request.Email,
          link: `${PUBLIC_ASSETS_BASE_URL}/newsletter/subscriber/${userCode}/confirmation`,
        },
      });

      if (scheduledOrError.isRight()) {
        Logger.fatal(scheduledOrError.value);
      }
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
