import { backgroundJobsDb } from "../database/postgres/connection/knexfile";


export interface QueueProviderProtocol{
  queue(
    request: {
      name: string;
      priority: number;
      retryLimit: number;
      retryDelay: number;
      startAfter?: string | Date;
      singletonkey?: string;
      data: any;
    }
  ): Promise<any | null>
  removeByKey(key: string): Promise<void>
}

export class QueueProvider implements QueueProviderProtocol{
  async queue(
    request: {
      name: string;
      priority: number;
      retryLimit: number;
      retryDelay: number;
      startAfter?: string;
      singletonkey?: string;
      data: any;
    }
  ): Promise<any | null>{
    const data = {
      name: request.name,
      priority: request.priority || 1,
      data: request.data || null,
      retrylimit: request.retryLimit || 3,
      retrydelay: request.retryDelay || 60,
    };

    if (Reflect.has(request, "startAfter")) {
      Object.assign(data, {
        startafter: request.startAfter,
      });
    }

    if (Reflect.has(request, "singletonkey")) {
      Object.assign(data, {
        singletonkey: request.singletonkey,
      });
    }

    const result = await backgroundJobsDb
      .insert(data)
      .returning("*")
      .into("pgboss.job");

    const job = result[0];

    return {
      id: job.id,
      name: job.name,
      priority: job.priority,
      data: job.data,
      state: job.state,
      retrylimit: job.retrylimit,
      retrycount: job.retrycount,
      retrydelay: job.retrydelay,
      retrybackoff: job.retrybackoff,
      startafter: job.startafter,
      startedon: job.startedon,
      singletonkey: job.singletonkey,
      singletonon: job.singletonon,
      expirein: job.expirein,
      createdon: job.createdon,
      completedon: job.completedon,
      keepuntil: job.keepuntil,
      on_complete: job.on_complete,
      output: job.output,
    };
  }

  async removeByKey(key: string): Promise<void> {
    await backgroundJobsDb("pgboss.job")
      .delete()
      .where({
        singletonkey: key,
      });
    }
}
