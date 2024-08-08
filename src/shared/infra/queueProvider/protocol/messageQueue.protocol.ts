export interface MessageQueueProtocol {
  send(queue: string, data: any, exchange?: string): Promise<any>;
}
