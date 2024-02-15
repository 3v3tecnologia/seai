import { route } from "./common";

const getDataKey = "";
const submitDataKey = "CREATE_CULTURE";
const storeDataKey = ["culture", "update"];
const headerLabel = "Criando cultura";

const finishedDataButton = {
  text: "Retornar a listagem de culturas",
  routeName: "culture",
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields: route.fields,
};
