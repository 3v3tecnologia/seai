export default {
  state: () => ({
    pageTitle: "",
  }),
  mutations: {
    ["SET_PAGE_TITLE"](state, title) {
      state.pageTitle = title;
    },
  },
  actions: {
    async ["CLEAR_PAGE_TITLE"]({ commit }) {
      commit("SET_PAGE_TITLE", "");
    },
  },
};
