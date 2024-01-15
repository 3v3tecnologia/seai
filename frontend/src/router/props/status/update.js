import { route } from "./common";

const getDataKey = "GET_CURRENT_STATUS";

const submitDataKey = "UPDATE_STATUS";

const storeDataKey = ["status", "update"];

const headerLabel = "Editando status de rotinas";

const finishedDataButton = {
  text: "Retornar a listagem de notícias",
  routeName: "status",
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields: route.fields,
  navBarTab: route.navBarTab,
};
