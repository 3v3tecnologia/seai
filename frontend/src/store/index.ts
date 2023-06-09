import { createStore } from "vuex";
import authModule from "./modules/authModule";

export default createStore({
  modules: {
    auth: authModule,
  },
});
