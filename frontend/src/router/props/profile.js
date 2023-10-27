const getDataKey = "GET_PROFILE";

const submitDataKey = "UPDATE_PROFILE";

const storeDataKey = "profile";

const headerLabel = "Atualizar dados de perfil";

const fields = [
  {
    label: "Nome",
    formKey: "name",
    type: "text",
  },
  {
    label: "Login",
    formKey: "login",
    type: "text",
  },
  {
    label: "Email",
    formKey: "email",
    type: "email",
  },
];

export const profile = {
  getDataKey,
  storeDataKey,
  submitDataKey,
  headerLabel,
  fields,
};
