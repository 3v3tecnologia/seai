import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import VueApexCharts from "vue3-apexcharts";
import router from "./router";
import { store } from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faUserSecret,
  faPlus,
  faPen,
  faTrash,
  faSignOut,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret, faPlus, faRefresh, faPen, faTrash, faSignOut);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .use(VueApexCharts)
  .mount("#app");
