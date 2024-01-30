import PageNotFoundView from "@/views/PageNotFoundView.vue";
import culture from "@/router/routes/culture";
import newsletter from "@/router/routes/newsletter";
import status from "@/router/routes/status";
import cron from "@/router/routes/cron";
import users from "@/router/routes/users";
import businessInteligence from "@/router/routes/businessInteligence";
import metereologicalBodies from "@/router/routes/metereologicalBodies";
import equipments from "@/router/routes/equipments";
import account from "@/router/routes/account";

export default [
  ...account,
  ...equipments,
  ...metereologicalBodies,
  ...businessInteligence,
  ...cron,
  ...culture,
  ...users,
  ...newsletter,
  ...status,
  {
    path: "/:catchAll(.*)",
    meta: {
      title: `Rota não encontrada`,
    },
    component: PageNotFoundView,
  },
];
