import moment from "moment/moment";

const usersOptionsFilter = {
  label: "Função",
  field: "type",
  options: [
    {
      title: "Todos",
      value: null,
    },
    {
      title: "Básico",
      value: 1,
    },
    {
      title: "Admin",
      value: 2,
    },
  ],
};

const usersSearchFilter = ["name", "email"];

export default {
  actionText: "usuário",
  getDataKey: "GET_USERS",
  deleteDataKey: "DELETE_USERS",
  storeDataKey: "users",
  filters: [usersOptionsFilter],
  searchFilter: usersSearchFilter,
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
