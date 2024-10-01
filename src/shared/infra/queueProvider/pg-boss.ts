import { backgroundJobsDb } from "../database/postgres/connection/knexfile";
import { MQProviderProtocol } from "./protocol/messageQueue.protocol";

export class PgBossAdapter implements MQProviderProtocol {
  async sendToQueue(
    queue: string,
    message: any,
  ): Promise<void> {
    const defaultOptions = {
      retrylimit: 3,
      retrydelay: 60,
    };

    const data = {
      name: queue,
      data: message || null,
      ...defaultOptions,
    };

    await backgroundJobsDb
      .insert(data)
      .returning("*")
      .into("pgboss.job");

  }
}
