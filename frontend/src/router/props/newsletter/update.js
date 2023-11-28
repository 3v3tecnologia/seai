const getDataKey = "GET_CURRENT_NEWSLETTER";

const submitDataKey = "UPDATE_EQUIPMENT";

const storeDataKey = ["newsletter", "update"];

const headerLabel = "Editando notícia";

const fields = [
  {
    label: "Título",
    formKey: "Title",
    type: "text",
  },
  {
    formKey: "Time",
    component: {
      name: "FilterDate",
      props: {
        label: "Data de envio",
        showTime: true,
        hourFormat: "24",
        selectionMode: "single",
      },
    },
  },
  {
    label: "Autor",
    formKey: "Auth",
    type: "text",
  },
  {
    label: "Nome da localização",
    formKey: "LocationName",
    type: "text",
  },
  // {
  //   formKey: "Text",
  //   component: {
  //     name: "FieldEditor",
  //     props: {
  //       label: "Mensagem",
  //     },
  //   },
  // },
];

const finishedDataButton = {
  text: "Retornar a listagem de equipamentos",
  routeName: "equipments",
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields,
  navBarTab: 6,
};
