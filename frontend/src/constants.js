import { mapOptions } from "./helpers/dto";

export const itemsPerGraph = 10;

export const defaultOption = {
  title: "Todos",
  key: "Todos",
  value: null,
};

export const defaultPagination = {
  itemPerPage: 5,
};

export const limit = defaultPagination.itemPerPage;

export const dataFormatUrl = {
  1: "basin",
  2: "county",
  3: "consumption",
};

export const cronsOptions = [
  {
    key: "0 0 * * *",
    value: "Diariamente (00:00)",
  },
  {
    key: "0 * * * *",
    value: "A cada início de hora",
  },
];

export const statusOptions = [
  {
    key: "created",
    value: "Criado",
  },
  {
    key: "completed",
    value: "Completado",
  },
  {
    key: "retry",
    value: "Tentando novamente",
  },
  {
    key: "active",
    value: "Em execução",
  },
  {
    key: "completed",
    value: "Completado",
  },
  {
    key: "expired",
    value: "Expirado",
  },
  {
    key: "cancelled",
    value: "Cancelado",
  },
  {
    key: "failed",
    value: "Execução falhou",
  },
];

export const mapedCronsOptions = mapOptions(cronsOptions);
export const mapedStatusOptions = mapOptions(statusOptions);

export const defaultCron = {
  name: "",
  cron: "0 0 * * *",
  timezone: "America/Fortaleza",
  data: null,
  tz: "America/Fortaleza",
  priority: 2,
  retryDelay: 60,
  retryLimit: 3,
  created_on: "",
  updated_on: "",
};

export const defaultStatus = {
  timezone: "America/Fortaleza",
  priority: 2,
  retrydelay: 60,
  retrylimit: 3,
};
