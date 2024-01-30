import { defaultCron } from "@/constants";
import { route } from "./common";

const headerLabel = "Cadastrando rotina de dados";

export default {
  fields: route.fields,
  getDataKey: "",
  storeDataKey: "",
  submitDataKey: "CREATE_CRON",
  headerLabel,
  finishedDataButton: route.finishedDataButton,
  defaultValue: defaultCron,
};
