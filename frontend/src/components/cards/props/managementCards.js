import managementList from "./managementList";

export default {
  item: {
    type: Object,
    default: () => ({}),
  },
  ...managementList,
};
