import { backgroundJobsDb } from "../database/postgres/connection/knexfile";
import { TaskSchedulerProviderProtocol } from "./protocol/jog-scheduler.protocol";

export class PgBossAdapter implements TaskSchedulerProviderProtocol {
  async send(
    queue: string,
    message: any,
    options?: {
      priority?: number;
      retryLimit?: number;
      retryDelay?: number;
      startAfter?: string | Date;
      singletonkey?: string;
    }
  ): Promise<any | null> {
    const defaultOptions = {
      priority: 1,
      retrylimit: 3,
      retrydelay: 60,
    };
    const data = {
      name: queue,
      data: message || null,
      ...defaultOptions,
    };

    if (options) {
      if (Reflect.has(options, "startAfter")) {
        Object.assign(data, {
          startafter: options.startAfter,
        });
      }

      if (Reflect.has(options, "singletonkey")) {
        Object.assign(data, {
          singletonkey: options.singletonkey,
        });
      }
    }

    const result = await backgroundJobsDb
      .insert(data)
      .returning("*")
      .into("pgboss.job");

    const job = result[0];

    return job.id;
  }

  async removeByKey(key: string): Promise<void> {
    await backgroundJobsDb("pgboss.job").delete().where({
      singletonkey: key,
    });
  }
}
