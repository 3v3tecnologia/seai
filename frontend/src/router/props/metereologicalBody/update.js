import { route } from "./common";
const getDataKey = "GET_CURRENT_BODY";

const submitDataKey = "UPDATE_BODY";

const storeDataKey = "currentBody";

const headerLabel = "Editando órgão meteorológico";

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  headerLabel,
  fields: route.fields,
};
