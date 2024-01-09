import { route } from "./common";

const getDataKey = "GET_CURRENT_CRON";

const submitDataKey = "UPDATE_CRON";

const storeDataKey = ["cron", "update"];

const headerLabel = "Editando rotina de busca dados";

const finishedDataButton = {
  text: "Retornar a listagem de notícias",
  routeName: "cron",
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
