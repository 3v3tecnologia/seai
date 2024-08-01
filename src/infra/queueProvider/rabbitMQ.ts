import { MessageQueueProtocol } from "./protocol/messageQueue.protocol";

export class RabbitMQAdapter implements MessageQueueProtocol {
  send(queue: string, data: any, exchange?: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
