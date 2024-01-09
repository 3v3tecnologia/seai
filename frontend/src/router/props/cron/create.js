import { route } from "./common";
import cron from "./update";

const headerLabel = "Cadastrando rotina de dados";

export default {
  fields: cron.fields,
  getDataKey: "GET_CURRENT_CRON",
  storeDataKey: ["cron", "update"],
  submitDataKey: "CREATE_CRON",
  headerLabel,
  finishedDataButton: cron.finishedDataButton,
  navBarTab: route.navBarTab,
};
