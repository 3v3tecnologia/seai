export default {
  state: () => ({
    pageExtraTitle: "",
  }),
  mutations: {
    ["SET_PAGE_TITLE"](state, title) {
      state.pageExtraTitle = title;
    },
  },
  actions: {
    async ["CLEAR_PAGE_TITLE"]({ commit }) {
      commit("SET_PAGE_TITLE", "");
    },
  },
};
