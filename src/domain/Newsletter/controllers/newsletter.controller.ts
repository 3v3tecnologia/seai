import { mapToPaginatedInput } from "../../../shared/utils/command";
import { badRequest, created, forbidden, ok, serverError } from "../../../shared/utils/http-responses";
import { newsletterService } from "../services";
import newsletterValidator from './schema/newsletter-validator';
import { CreateNewsletterRequest, DeleteNewsletterRequest, GetAllNewslettersRequest, GetAllPreviewsRequest, GetOnlySentNewsletterRequest, MarkAsSentRequest, UpdateNewsletterRequest } from "./schema/request";

export class NewsletterController {
  static async create(request: CreateNewsletterRequest) {
    try {
      const { Data, Description, SendDate, Title, accountId } = request;

      const dto = {
        Data,
        Description,
        SendDate,
        Title,
        accountId,
      };

      const { error } = await newsletterValidator.createNews.validate(dto);

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.create({
        data: dto,
        audit: {
          author: accountId,
          operation: ''
        }
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async delete(request: DeleteNewsletterRequest) {
    try {
      const { id, Operation, accountId } = request;

      const { error } = await newsletterValidator.deleteNews.validate({
        id,
        Operation,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.delete({
        data: {
          id: request.id
        },
        audit: {
          author: accountId,
          operation: Operation,
        }
      })

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async update(request: UpdateNewsletterRequest) {
    try {
      const { id, Data, Description, SendDate, Title, Operation, accountId } =
        request;

      const { error } = await newsletterValidator.updateNews.validate({
        id,
        Data,
        Description,
        SendDate,
        Title,
        Operation,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.update(
        {
          data: {
            Id: request.id,
            Data: request.Data,
            Description: request.Description,
            Title: request.Title,
            SendDate: request.SendDate,
          },
          audit: {
            author: accountId,
            operation: Operation,
          }
        }
      );

      if (createdOrError.isLeft()) {
        return badRequest(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async updateSendAt(request: MarkAsSentRequest) {
    try {
      const { date } = request;

      const { error } = await newsletterValidator.updateSendAt.validate({
        date,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.markAsSent(request.date);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getById(request: {
    id: number;
  }
  ) {
    try {
      const { id } = request;

      const { error } = await newsletterValidator.fetchNewsById.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.getById(request.id);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getOnlySent(request: GetOnlySentNewsletterRequest) {
    try {
      const { limit, offset, pageNumber } = request;

      const toValidate = {
        limit,
        offset,
        pageNumber,
      };

      if (Reflect.has(request, "title")) {
        Object.assign(toValidate, {
          title: request.title,
        });
      }

      if (Reflect.has(request, "sendDate")) {
        Object.assign(toValidate, {
          sendDate: request.sendDate,
        });
      }

      const { error } = await newsletterValidator.fetchOnlySent.validate(toValidate);

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.getOnlySent(mapToPaginatedInput({
        sendDate: request.sendDate,
        title: request.title
      }, {
        limit,
        offset,
        pageNumber
      }));

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getAll(request: GetAllNewslettersRequest) {
    try {
      const { limit, offset, pageNumber } = request;

      const toValidate = {
        limit,
        offset,
        pageNumber,
      };

      if (Reflect.has(request, "title")) {
        Object.assign(toValidate, {
          title: request.title,
        });
      }

      if (Reflect.has(request, "sendDate")) {
        Object.assign(toValidate, {
          sendDate: request.sendDate,
        });
      }

      const { error } = await newsletterValidator.fetchNews.validate(toValidate);

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await newsletterService.getAll(mapToPaginatedInput({
        sendDate: request.sendDate,
        title: request.title
      }, {
        limit,
        offset,
        pageNumber
      }));

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return ok(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getUnsent(request: GetAllPreviewsRequest) {
    try {
      const { date } = request;


      const resultOrError = await newsletterService.getUnsentBySendDate(date);

      if (resultOrError.isLeft()) {
        return forbidden(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getSubscribers() {
    try {
      const resultOrError = await newsletterService.getSubscribers();

      if (resultOrError.isLeft()) {
        return forbidden(resultOrError.value);
      }

      return created(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
