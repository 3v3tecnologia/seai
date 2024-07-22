import { PUBLIC_ASSETS_BASE_URL } from "../../../server/http/config/url";
import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/logger/logger";
import { Command } from "../_ports/core/command";
import { Encoder } from "../_ports/cryptography/encoder";
import { NewsletterSubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { CreateJobUseCaseProtocol } from "../jobs";

export class SubscribeToNews
  extends Command
  implements SubscribeToNewsUseCaseProtocol.UseCase
{
  private repository: NewsletterSubscriberRepositoryProtocol;
  private readonly queueService: CreateJobUseCaseProtocol.UseCase;
  private readonly encoder: Encoder;

  constructor(
    repository: NewsletterSubscriberRepositoryProtocol,
    queueService: CreateJobUseCaseProtocol.UseCase,
    encoder: Encoder
  ) {
    super();
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

    const subscriberId = await this.repository.create({
      Email: request.Email,
      Name: request.Name,
      Code: userCode as string,
    });

    if (subscriberId) {
      const scheduledOrError = await this.queueService.execute({
        name: "newsletter-subscriber-notification",
        priority: 3,
        retryDelay: 180,
        retryLimit: 3,
        data: {
          action: "subscribe",
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
    Name: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
