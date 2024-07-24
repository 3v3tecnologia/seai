import {
  IPaginationInput,
  OldOutputWithPagination,
} from "../../helpers/pagination";

export interface Jobs {
  id: string;
  name: string;
  priority: string;
  data: any;
  state: string;
  retrylimit: string;
  retrycount: string;
  retrydelay: string;
  retrybackoff: string;
  startafter: string;
  startedon: string;
  expirein: string;
  createdon: string;
  completedon: string;
  keepuntil: string;
  on_complete: string;
  output: string;
}
export interface Cron {
  name: string;
  cron: string;
  timezone: any;
  data: string;
  options: string;
  updated_on: string;
  created_on: string;
}

export namespace ScheduleRepositoryDTO {
  export namespace Create {
    export type Request = {
      name: any;
      cron: any;
      timezone: any;
      data: any;
      options: any;
    };
    export type Response = Promise<void>;
  }

  export namespace Update {
    export type Request = {
      name: any;
      cron: any;
      timezone: any;
      data: any;
      options: any;
    };
    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      name: string;
    };
    export type Response = Promise<void>;
  }

  export namespace GetByQueue {
    export type Request = {
      queue: string;
    };
    export type Response = Promise<any | null>;
  }
  export namespace GetAll {
    export type Request = IPaginationInput & { queue?: string };
    export type Response = Promise<OldOutputWithPagination<any> | null>;
  }
}

export namespace JobsRepositoryDTO {
  export namespace Create {
    export type Request = {
      name: string;
      priority: number;
      retryLimit: number;
      retryDelay: number;
      startAfter?: Date;
      singletonkey?: string;
      data: any;
    };

    export type Response = Promise<any | null>;
  }

  export namespace Update {
    export type Request = {
      id: string;
      name: string;
      state?: string;
      priority: number;
      retryLimit: number;
      retryDelay: number;
      startAfter?: Date;
      data: any;
    };

    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      id: string;
    };

    export type Response = Promise<void>;
  }

  export namespace Fetch {
    export type Request = IPaginationInput & {
      queue?: string;
      state?: string;
    };
    export type Response = Promise<OldOutputWithPagination<any> | null>;
  }

  export namespace FetchById {
    export type Request = string;
    export type Response = Promise<any | null>;
  }

  export namespace FetchJobsStates {
    export type Request = void;
    export type Response = Promise<Array<string> | null>;
  }
}

export interface ScheduleRepositoryProtocol {
  createSchedule(
    request: ScheduleRepositoryDTO.Create.Request
  ): ScheduleRepositoryDTO.Create.Response;
  updateSchedule(
    request: ScheduleRepositoryDTO.Update.Request
  ): ScheduleRepositoryDTO.Update.Response;
  deleteSchedule(
    request: ScheduleRepositoryDTO.Delete.Request
  ): ScheduleRepositoryDTO.Delete.Response;
  getScheduleByQueue(
    request: ScheduleRepositoryDTO.GetByQueue.Request
  ): ScheduleRepositoryDTO.GetByQueue.Response;
  getAllSchedule(
    request: ScheduleRepositoryDTO.GetAll.Request
  ): ScheduleRepositoryDTO.GetAll.Response;
}

export interface JobsRepositoryProtocol {
  createJob(
    request: JobsRepositoryDTO.Create.Request
  ): JobsRepositoryDTO.Create.Response;
  updateJob(
    request: JobsRepositoryDTO.Update.Request
  ): JobsRepositoryDTO.Update.Response;
  deleteJob(
    request: JobsRepositoryDTO.Delete.Request
  ): JobsRepositoryDTO.Delete.Response;
  getJobsStates(
    request: JobsRepositoryDTO.FetchJobsStates.Request
  ): JobsRepositoryDTO.FetchJobsStates.Response;
  getJobs(
    request: JobsRepositoryDTO.Fetch.Request
  ): JobsRepositoryDTO.Fetch.Response;
  getJobById(
    request: JobsRepositoryDTO.FetchById.Request
  ): JobsRepositoryDTO.FetchById.Response;
  deleteJobByKey(key: string): Promise<void>;
}
