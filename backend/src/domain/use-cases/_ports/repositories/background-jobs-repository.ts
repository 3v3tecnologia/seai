import { InputWithPagination, OutputWithPagination } from "../../helpers/dto";

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
      Name: any;
      Cron: any;
      Timezone: any;
      Data: any;
      Option: any;
    };
    export type Response = Promise<void>;
  }

  export namespace Update {
    export type Request = {
      Name: any;
      Cron: any;
      Timezone: any;
      Data: any;
      Option: any;
    };
    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      Name: string;
    };
    export type Response = Promise<void>;
  }

  export namespace GetByQueue {
    export type Request = {
      Queue: string;
    };
    export type Response = Promise<any | null>;
  }
  export namespace GetAll {
    export type Request = InputWithPagination & { queue?: string };
    export type Response = Promise<OutputWithPagination<Array<any>> | null>;
  }
}

export namespace JobsRepositoryDTO {
  export namespace Create {
    export type Request = {
      Queue: string;
      Priority: number;
      RetryLimit: number;
      RetryDelay: number;
      Data: any;
    };

    export type Response = Promise<any | null>;
  }

  export namespace Update {
    export type Request = {
      Id: string;
      Queue: string;
      Priority: number;
      RetryLimit: number;
      RetryDelay: number;
      Data: any;
    };

    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      Id: string;
    };

    export type Response = Promise<void>;
  }

  export namespace Fetch {
    export type Request = InputWithPagination & {
      queue?: string;
      state?: string;
    };
    export type Response = Promise<OutputWithPagination<Array<any>> | null>;
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
}
