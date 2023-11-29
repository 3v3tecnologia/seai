import { toast } from "vue3-toastify";

export default {
  state: () => ({
    list: {
      data: [],
    },
    update: {},
  }),
  mutations: {
    ["SET_LIST"](state, list) {
      state.list = list;
    },
    ["SET_CURRENT"](state, newsletter) {
      state.update = newsletter;
    },
  },
  actions: {
    GET_NEWSLETTERS: {
      async handler({ commit }) {
        try {
          const newsletters = [
            {
              id: 1,
              Title: "Alerta de custo de água",
              Text: '<p>dasdsadasdas<strong style="background-color: rgb(230, 0, 0);">dasdasdas</strong></p>',
              Auth: "Lucas",
              LocationName: "Fortaleza-CE",
              Time: "2023-08-22",
              Hour: "23",
            },
          ];

          console.log("pedindo dado de newsletters", newsletters);

          commit("SET_LIST", {
            data: newsletters,
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar notícias.");
        }
      },
    },
    GET_CURRENT_NEWSLETTER: {
      async handler({ state, commit, dispatch }, id) {
        try {
          await dispatch("GET_NEWSLETTERS");
          const newsletter = state.list.data.find((c) => c.id == id);

          commit("SET_CURRENT", newsletter);
        } catch (e) {
          console.error(e);
        }
      },
    },
  },
  getters: {},
};
