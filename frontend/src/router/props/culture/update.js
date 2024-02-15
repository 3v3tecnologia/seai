import { route } from "./common";

const getDataKey = "GET_CURRENT_CULTURE";
const submitDataKey = "UPDATE_CULTURE";
const storeDataKey = ["culture", "update"];
const headerLabel = "Editando cultura";

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
