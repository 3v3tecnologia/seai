import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { InjectionKey } from "vue";

import IAuth from "@/interfaces/IAuth";
import IUser from "@/interfaces/IUser";
import http from "@/http";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Estado {
  auth: IAuth | null;
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    auth: null,
  },
  mutations: {
    ["SET_USER"](state, user: IAuth) {
      state.auth = user;
    },
  },
  actions: {
    ["SIGN_OUT"]({ commit }) {
      commit("SET_USER", null);
    },
    async ["SEND_EMAIL_CHANGE_PASSWORD"]({ commit }, { login, email }) {
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
    async ["CHANGE_PASSWORD"]({ commit }, { password, token }) {
      try {
        // TODO
        // CONNECT API
        // const { data: userLogged } = await http.post(`/change-password`, {password, token});

        toast.success("Senha atualizada com sucesso.");
        return true;
      } catch (e) {
        toast.error("Credenciais inválidas.");
      }
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
