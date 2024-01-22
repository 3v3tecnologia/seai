import { route } from "./common";
const getDataKey = "GET_CURRENT_NEWSLETTER";

const submitDataKey = "UPDATE_NEWSLETTER";

const storeDataKey = ["newsletter", "update"];

const headerLabel = "Editando notícia";

const finishedDataButton = {
  text: "Retornar a listagem de notícias",
  routeName: "newsletter",
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
