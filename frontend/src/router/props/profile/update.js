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

const finishedDataButton = {
  text: "Retornar a listagem de usuários",
  routeName: "users",
};

export default {
  getDataKey,
  navBarTab: 5,
  storeDataKey,
  submitDataKey,
  headerLabel,
  fields,
  finishedDataButton,
};
