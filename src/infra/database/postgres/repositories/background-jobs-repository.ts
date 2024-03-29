import {
  JobsRepositoryDTO,
  JobsRepositoryProtocol,
  ScheduleRepositoryDTO,
  ScheduleRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/background-jobs-repository";

import { DATABASES } from "../../../../shared/db/tableNames";
import { backgroundJobsDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbBackgroundJobsRepository
  implements ScheduleRepositoryProtocol, JobsRepositoryProtocol
{
  async createSchedule(
    request: ScheduleRepositoryDTO.Create.Request
  ): ScheduleRepositoryDTO.Create.Response {
    await backgroundJobsDb
      .insert({
        name: request.name,
        cron: request.cron,
        timezone: request.timezone,
        data: request.data,
        options: request.options,
        updated_on: backgroundJobsDb.fn.now(),
      })
      .into(DATABASES.BACKGROUND_JOBS.TABLES.SCHEDULE);
  }

  async updateSchedule(
    request: ScheduleRepositoryDTO.Update.Request
  ): ScheduleRepositoryDTO.Update.Response {
    await backgroundJobsDb(DATABASES.BACKGROUND_JOBS.TABLES.SCHEDULE)
      .where({
        name: request.name,
      })
      .update({
        cron: request.cron,
        timezone: request.timezone,
        data: request.data,
        options: request.options,
        updated_on: backgroundJobsDb.fn.now(),
      });
  }

  async deleteSchedule(
    request: ScheduleRepositoryDTO.Delete.Request
  ): ScheduleRepositoryDTO.Delete.Response {
    await backgroundJobsDb(DATABASES.BACKGROUND_JOBS.TABLES.SCHEDULE)
      .where({ name: request.name })
      .delete();
  }

  async getScheduleByQueue(
    request: ScheduleRepositoryDTO.GetByQueue.Request
  ): ScheduleRepositoryDTO.GetByQueue.Response {
    const { rows } = await backgroundJobsDb.raw(
      `
      SELECT 
          n."name" ,
          n."cron" ,
          n."timezone" ,
          n."data" ,
          n."options" ,
          n."created_on" ,
          n."updated_on"
      FROM ${DATABASES.BACKGROUND_JOBS.TABLES.SCHEDULE} n 
      WHERE n."name"= ?;
    `,
      [request.queue]
    );

    if (!rows.length) {
      return null;
    }

    const schedule = rows[0];

    return schedule;
  }

  async getAllSchedule(
    request: ScheduleRepositoryDTO.GetAll.Request
  ): ScheduleRepositoryDTO.GetAll.Response {
    const limit = request.limit || 50;
    const pageNumber = Number(request.pageNumber) || 1;
    const pageOffset = pageNumber ? (pageNumber - 1) * limit : 0;
    const args = [pageOffset];
    const whereQueries = [];
    const whereClause: Array<any> = [];

    let baseQuery = `SELECT "name", cron, timezone, "data", "options", created_on, updated_on
      FROM ${DATABASES.BACKGROUND_JOBS.TABLES.SCHEDULE} \n`;

    if (request.queue) {
      whereQueries.push({ query: `"name" = ?`, params: request.queue });
    }

    if (whereQueries.length) {
      whereQueries.forEach((param: any) => {
        if (param.params) {
          // whereClause.push(param.query.concat(args.length + 1));
          args.push(param.params);
        }
      });

      baseQuery += `WHERE ${whereClause.join(" AND ")} \n`;
    }

    baseQuery += "LIMIT 50 OFFSET ?;";

    const { rows } = await backgroundJobsDb.raw(baseQuery, args);

    return withPagination(rows, {
      count: rows.length,
      limit,
      offset: pageOffset,
      page: pageNumber,
    });
  }

  async getJobs(
    request: JobsRepositoryDTO.Fetch.Request
  ): JobsRepositoryDTO.Fetch.Response {
    const limit = request.limit || 50;
    const pageNumber = Number(request.pageNumber) || 1;
    const pageOffset = pageNumber ? (pageNumber - 1) * limit : 0;
    const whereQueries = [];

    const query = backgroundJobsDb
      .select(
        "id",
        "name",
        "priority",
        "data",
        "state",
        "retrylimit",
        "retrycount",
        "retrydelay",
        "retrybackoff",
        "startafter",
        "startedon",
        "expirein",
        "createdon",
        "completedon",
        "keepuntil",
        "on_complete",
        "output"
      )
      .where("name", "not like", "__pgboss%") // remove pg_boss default jobs
      .from(DATABASES.BACKGROUND_JOBS.TABLES.JOB);

    if (request.queue) {
      whereQueries.push({ column: "name", params: request.queue });
    }

    if (request.state) {
      whereQueries.push({ column: "state", params: request.state });
    }

    if (whereQueries.length) {
      const whereCondition = whereQueries.pop();

      if (whereCondition?.params) {
        query.where({
          [whereCondition.column]: whereCondition.params,
        });
      }

      if (whereQueries.length) {
        whereQueries.forEach((where) => {
          if (where.params) {
            query.andWhere({
              [where.column]: where.params,
            });
          }
        });
      }
    }

    query.limit(limit).offset(pageOffset);

    const rows = await query;

    return withPagination(rows, {
      count: rows.length,
      limit,
      offset: pageOffset,
      page: pageNumber,
    });
  }

  async createJob(
    request: JobsRepositoryDTO.Create.Request
  ): JobsRepositoryDTO.Create.Response {
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

    const result = await backgroundJobsDb
      .insert(data)
      .returning("*")
      .into(DATABASES.BACKGROUND_JOBS.TABLES.JOB);

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

  async updateJob(
    request: JobsRepositoryDTO.Update.Request
  ): JobsRepositoryDTO.Update.Response {
    const data = {
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

    if (Reflect.has(request, "state")) {
      Object.assign(data, {
        state: request.state,
      });
    }
    if (Reflect.has(request, "name")) {
      Object.assign(data, {
        name: request.name,
      });
    }

    await backgroundJobsDb(DATABASES.BACKGROUND_JOBS.TABLES.JOB)
      .update(data)
      .where({
        id: request.id,
      });
  }

  async deleteJob(
    request: JobsRepositoryDTO.Delete.Request
  ): JobsRepositoryDTO.Delete.Response {
    await backgroundJobsDb(DATABASES.BACKGROUND_JOBS.TABLES.JOB)
      .delete()
      .where({
        id: request.id,
      });
  }

  async getJobById(
    id: JobsRepositoryDTO.FetchById.Request
  ): JobsRepositoryDTO.FetchById.Response {
    const result = await backgroundJobsDb
      .select(
        "id",
        "name",
        "priority",
        "data",
        "state",
        "retrylimit",
        "retrycount",
        "retrydelay",
        "retrybackoff",
        "startafter",
        "startedon",
        "expirein",
        "createdon",
        "completedon",
        "keepuntil",
        "on_complete",
        "output"
      )
      .from(DATABASES.BACKGROUND_JOBS.TABLES.JOB)
      .where({
        id,
      });

    if (!result.length) {
      return null;
    }

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
  async getJobsStates(): JobsRepositoryDTO.FetchJobsStates.Response {
    const { rows } = await backgroundJobsDb.raw(`SELECT     
       e.enumlabel AS state
        FROM
            pg_type t
        JOIN pg_enum e ON
            t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON
            n.oid = t.typnamespace
        WHERE
            t.typname = 'job_state';`);

    if (!rows.length) {
      return null;
    }

    return rows.map((row: any) => {
      return row.state;
    });
  }
}
