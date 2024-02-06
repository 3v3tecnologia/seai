export default {
  titleKey: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    default: () => [],
  },
  chips: {
    type: Array,
    default: () => [],
  },
};
