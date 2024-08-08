export interface TaskSchedulerProviderProtocol {
  send(
    queue: string,
    data: any,
    options?: {
      priority?: number;
      retryLimit?: number;
      retryDelay?: number;
      startAfter?: string | Date;
      singletonkey?: string;
    }
  ): Promise<any | null>;
  removeByKey(key: string): Promise<void>;
}
