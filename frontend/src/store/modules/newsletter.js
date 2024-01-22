import { formatDateWithHour } from "@/helpers/date";
import {
  decodeByteArr,
  encodeBin,
  toTimestamp,
  unwrapNewsLetter,
} from "@/helpers/dto";
import http from "@/http";
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
          const {
            data: { data },
          } = await http.get(`/news`);

          const newsletters = data?.Data || [];

          commit("SET_LIST", {
            data: newsletters.map(unwrapNewsLetter).map((n) => {
              // n.FullTime = formatDateWithHour(n.Time, n.Hour);

              return n;
            }),
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar notícias.");
        }
      },
    },
    CREATE_NEWSLETTER: {
      async handler(_, form) {
        try {
          const newsletter = {
            FK_Author: 1,
            Title: form.Title,
            Description: form.Description,
            Data: encodeBin(form.Text),
            SendDate: toTimestamp(form.SendDate),
          };

          await http.post(`/news/`, newsletter);
          toast.success("Notícia criada com sucesso.");
        } catch (e) {
          console.error(e);
          toast.error("Falha ao criar notícia.");
          throw Error(e?.response?.data?.error);
        }
      },
    },
    UPDATE_NEWSLETTER: {
      async handler(_, form) {
        try {
          const newsletter = {
            FK_Author: 1,
            Title: form.Title,
            Description: form.Description,
            Data: encodeBin(form.Text),
            SendDate: toTimestamp(form.SendDate),
          };

          await http.put(`/news/${form.Id}`, newsletter);
          toast.success("Notícia atualizada com sucesso.");
        } catch (e) {
          console.error(e);
          toast.error("Falha ao atualizar notícia.");
          throw Error(e?.response?.data?.error);
        }
      },
    },
    DELETE_NEWSLETTER: {
      async handler(_, ids) {
        try {
          await Promise.allSettled(
            ids.map(async (id) => await http.delete(`/news/${id}`))
          );
          toast.success("Sucesso ao deletar notícia(s)");
        } catch (e) {
          console.error(e);
          toast.success("Falha ao deletar notícia(s)");
          throw Error(e?.response?.data?.error);
        }
      },
    },
    GET_CURRENT_NEWSLETTER: {
      async handler({ commit }, id) {
        try {
          let {
            data: { data: newsletter },
          } = await http.get(`/news/${id}`);

          if (!newsletter) {
            throw new Error("Erro ao encontrar notícia.");
          }

          newsletter = unwrapNewsLetter(newsletter);
          // newsletter.FullTime = formatDateWithHour(
          //   newsletter.Time,
          //   newsletter.Hour
          // );

          newsletter.Text = decodeByteArr(newsletter.Data);

          commit("SET_CURRENT", newsletter);
        } catch (e) {
          commit("SET_CURRENT", {});
          console.error(e);
          toast.error(e);
        }
      },
    },
  },
  getters: {},
};
