import { Either, left, right } from "../../../shared/Either";
import { isDateInThePast } from "../../../shared/utils/date";

export type Content = {
  Id?: number;
  Title: string;
  // Author: {
  //   Id: number;
  //   Email: string;
  //   Organ: string;
  // };
  SendDate?: string;
  SentAt?: string | null;
  Description: string | null;
  // LocationName: string;
  Data?: any;
  CreatedAt?: string;
  UpdatedAt?: string;
};



// Check if the size exceeds 1MB (2 * 1024 * 1024 bytes)
export const NEWSLETTER_CONTENT_SIZE_LIMIT = 2 * 1024 * 1024;

export function validateContentSize(data: any): Either<Error, void> {
  // Convert the Data string to bytes
  const dataInBytes = new TextEncoder().encode(data);

  if (dataInBytes.length > NEWSLETTER_CONTENT_SIZE_LIMIT) {
    return left(
      new Error(
        `Conteúdo da notícia ultrapassa o limite de ${NEWSLETTER_CONTENT_SIZE_LIMIT} bytes.`
      )
    );
  }

  return right();
}

export function validateSendDate(date: Date): Either<Error, void> {
  if (isDateInThePast(date)) {
    return left(
      new Error(
        "Não é possível cadastrar uma notícia com data de envio no passado"
      )
    );
  }

  return right();
}
