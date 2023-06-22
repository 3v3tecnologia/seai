import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { InjectionKey } from "vue";

import IAuth from "@/interfaces/IAuth";
import IUrl from "@/interfaces/IUrl";
import IUrlMostAccesseds from "@/interfaces/IUrlMostAccesseds";
import IUser from "@/interfaces/IUser";
import http from "@/http";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Estado {
  auth: IAuth | null;
  urls: IUrl[];
  url_accessed: IUrl | null;
  urls_most_accesseds: IUrlMostAccesseds[];
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    auth: null,
    urls: [],
    url_accessed: null,
    urls_most_accesseds: [],
  },
  mutations: {
    ["ADD_URL"](state, url: IUrl) {
      state.urls.push(url);
    },
    ["SET_URLS"](state, urls: IUrl[]) {
      state.urls = urls;
    },
    ["REMOVE_URL"](state, url_register_id: number) {
      state.urls = state.urls.filter(
        (url) => url.url_register_id !== url_register_id
      );
    },
    ["DEFINE_TOP_URLS"](state, urlsMostAccesseds: IUrlMostAccesseds[]) {
      state.urls_most_accesseds = urlsMostAccesseds;
    },
    ["SET_URL_ACCESSED"](state, url: IUrl) {
      state.url_accessed = url;
    },
    ["SET_USER"](state, user: IAuth) {
      state.auth = user;
    },
  },
  actions: {
    async ["SAVE_URL"]({ commit, state }, url: string) {
      try {
        const isAlreadySaved = !!state.urls.find(
          (urlSaved) => urlSaved.url_basic === url
        );
        if (isAlreadySaved) {
          return;
        }
        const { data: urlCreated } = await http.post("/url", {
          url_basic: url,
        });
        commit("ADD_URL", urlCreated);

        toast.success("Url comprimida e salva com sucesso.");
      } catch (e) {
        toast.error("Falha ao comprimir url.");
      }
    },
    async ["FETCH_URL_ACCESSED"]({ commit }, hashParam: string) {
      try {
        const { data: urlDB } = await http.get(`/url/${hashParam}`);
        commit("SET_URL_ACCESSED", urlDB);
      } catch (e) {
        toast.error("Ocorreu um erro ao solicitar dados desta url.");
      }
    },
    ["SIGN_OUT"]({ commit }) {
      commit("SET_USER", null);
    },
    async ["FETCH_USER_URL"]({ commit }) {
      try {
        const { data: urls } = await http.get(`/user/url/`);
        commit("SET_URLS", urls);
      } catch (e) {
        toast.error("Falha ao solicitar dados iniciais");
      }
    },
    async ["CREATE_USER"]({ commit }, user: IUser) {
      try {
        // TODO
        // SEND HERE TO API THE OBJECT WITH LOGIN AND OR EMAIL
        // const { data: userCreated } = await http.post(`/user`, user);
        toast.success("Email de recuperação enviado com sucesso.");
      } catch (e) {
        toast.error("Falha ao enviar email de recuperação.");
      }
    },
    async ["LOGIN_USER"]({ commit }, user: IUser) {
      try {
        // TODO
        // CONNECT API
        // const { data: userLogged } = await http.post(`/auth`, user);

        const userLogged = {
          login: user.login,
          id: 1,
          token: "dlapsdlapsldapsdladlapsdld123123123123",
        };

        http.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userLogged.token}`;
        commit("SET_USER", userLogged);

        toast.success("Logado com sucesso.");
        return true;
      } catch (e) {
        toast.error("Credenciais inválidas.");
      }
    },
    async ["SEND_ACCESS_LOG"](context, urlRegisterId: number) {
      try {
        await http.post(`/url/access`, {
          url_register_id: urlRegisterId,
        });
      } catch (e) {
        toast.success("Erro ao acessar url descomprimida");
      }
    },
    async ["GET_TOP_URLS"]({ commit, state }) {
      try {
        const { data: urls } = await http.get("/url/most-access");
        commit("DEFINE_TOP_URLS", urls);
      } catch (e) {
        toast.error("Falha ao solicitar dados de urls mais acessadas");
      }
    },
    async ["DELETE_URL"]({ commit, state }, url_register_id) {
      try {
        await http.delete("/user/url", {
          data: {
            url_register_id,
          },
        });
        commit("REMOVE_URL", url_register_id);
        toast.success("Sucesso ao deletar url");
      } catch (e) {
        console.log({ e });
        toast.error("Falha ao deletar url");
      }
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
