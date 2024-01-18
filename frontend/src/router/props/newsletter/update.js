const getDataKey = "GET_CURRENT_NEWSLETTER";

const submitDataKey = "UPDATE_NEWSLETTER";

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
        selectionMode: "single",
        stepMinute: 1,
      },
    },
  },
  {
    label: "Descrição",
    formKey: "Description",
    type: "text",
  },
  {
    formKey: "Text",
    colSize: 12,
    component: {
      name: "FieldEditor",
      props: {
        label: "Mensagem",
      },
    },
  },
];

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
  fields,
  navBarTab: 3,
};
