export interface MQProviderProtocol {
  sendToQueue(queue: string, message: any): Promise<void>;
}
