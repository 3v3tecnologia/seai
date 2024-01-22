export const route = {
  navBarTab: 3,

  fields: [
    {
      label: "Título",
      formKey: "Title",
      type: "text",
    },
    {
      formKey: "SendDate",
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
  ],
};
