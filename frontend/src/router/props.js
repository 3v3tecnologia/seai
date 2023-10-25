import moment from "moment/moment";
import { usersOptions } from "@/constants.js";

const user = {
  actionText: "usuário",
  getDataKey: "GET_USERS",
  storeDataKey: "users",
  filters: [usersOptions],
  actionRoutes: {
    edit: "edit-user",
    create: "create-user",
  },
  headerLabels: [
    {
      key: "totalAdmins",
      title: "Administradores",
    },
    {
      key: "totalBasics",
      title: "Básicos",
    },
  ],
  columns: [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      align: "center",
      headerSort: false,
      width: 80,
    },
    {
      title: "Nome",
      field: "name",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Data de criação",
      field: "created_at",
      formatter: (col) => {
        return moment(col._cell.value).format("DD/MM/YYYY");
      },
    },
    {
      title: "Função",
      field: "type",
      formatter: (col) => {
        return col._cell.value === "admin" ? "Admin" : "Básico";
      },
    },
  ],
};

const equipments = {
  actionText: "equipamento",
  getDataKey: "GET_EQUIPMENTS",
  storeDataKey: "equipments",
  actionRoutes: {
    edit: "edit-equipment",
    create: "create-equipment",
  },
  headerLabels: [
    {
      key: "totalStations",
      title: "Estações",
    },
    {
      key: "totalPluviometers",
      title: "Pluviômetros",
    },
  ],
  // NomeTipoEquipamento
  // NomeLocalização
  // PossuiErrosDeLeituraPendentes
  columns: [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      align: "center",
      headerSort: false,
      width: 80,
    },
    {
      title: "Nome",
      field: "NomeEquipamento",
    },
    {
      title: "Identificador único externo",
      field: "IdExterno",
    },
    {
      title: "Órgão metereológico",
      field: "NomeOrgao",
    },
    {
      title: "Localização",
      field: "NomeLocalização",
    },
    {
      title: "Tipo",
      field: "NomeTipoEquipamento",
    },
    {
      title: "Status",
      field: "PossuiErrosDeLeituraPendentes",
      formatter: "tickCross",
    },
  ],
};

export default {
  user,
  equipments,
};
