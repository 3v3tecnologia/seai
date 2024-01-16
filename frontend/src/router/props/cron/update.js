import { route } from "./common";

const getDataKey = "GET_CURRENT_CRON";

const submitDataKey = "UPDATE_CRON";

const storeDataKey = ["cron", "update"];

const headerLabel = "Editando rotina de dados";

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton: route.finishedDataButton,
  headerLabel,
  fields: route.fields.map((c, i) => {
    if (!i) {
      return { ...c, disabled: true };
    } else {
      return c;
    }
  }),
  navBarTab: route.navBarTab,
};
