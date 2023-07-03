import moment from "moment";
import "vue3-toastify/dist/index.css";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { toast } from "vue3-toastify";
import { InjectionKey } from "vue";

import IAuth from "@/interfaces/IAuth";
import IUser from "@/interfaces/IUser";
import IUsersWrapper from "@/interfaces/IUsersWrapper";
import http from "@/http";

import { previewEmailCensured } from "@/helpers/formatEmail";

const limitReponse = 5;
interface Estado {
  auth: IAuth | null;
  users: IUsersWrapper | null;
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    auth: null,
    users: null,
  },
  mutations: {
    ["SET_USER"](state, user: IAuth) {
      state.auth = user;
    },
    ["SET_USERS"](state, users: IUsersWrapper) {
      state.users = users;
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
    async ["CREATE_ACCOUNT"]({ commit }, form) {
      try {
        // TODO
        // CONNECT API
        // const { data: userLogged } = await http.post(`/change-password`, {password, token});

        toast.success("Conta criada com sucesso.");
        toast.success(`Email enviado para ${previewEmailCensured(form.email)}`);
        return true;
      } catch (e) {
        toast.error("Erro ao criar usuário.");
      }
    },
    async ["GET_USERS"]({ commit }, { search, usersType, page }) {
      try {
        const tempSearch = search ? search : null;
        const tempUsersType = usersType ? usersType : null;
        const tempOffset = limitReponse * page - limitReponse;

        console.log("users get", tempSearch, tempUsersType, page);

        // TODO
        // CONNECT API
        // const { data: users } = await http.get(`/users?search=${tempSearch}&limit=${limit}&offset=${tempOffset}`, {password, token});

        const mockedUsers = [
          {
            name: "user1",
            email: "etc1@gmail.com",
            created_at: "2022-08-02 09:15:54.000",
            role: "admin",
            status: 1,
            id: 1,
          },
          {
            name: "user2",
            email: "etc2@gmail.com",
            created_at: "2022-08-03 09:15:54.000",
            role: "usuário",
            status: 0,
            id: 2,
          },
          {
            name: "user3",
            email: "etc3@gmail.com",
            created_at: "2022-08-01 09:15:54.000",
            role: "usuário",
            status: 1,
            id: 3,
          },
        ].map((user) => {
          user.created_at = moment(user.created_at).format("DD/MM/YYYY");

          return user;
        });

        const usersDTO = {
          data: mockedUsers,
          totalItems: mockedUsers.length,
          totalPages: Math.ceil(mockedUsers.length / limitReponse),
          totalAdmins: 23,
          totalBasics: 20,
          totalActives: 43,
          totalInactives: 3,
        };

        commit("SET_USERS", usersDTO);
      } catch (e) {
        toast.error("Credenciais inválidas.");
      }
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
