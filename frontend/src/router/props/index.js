import user from "./user/list";
import equipments from "./equipment/list";
import metereologicalBodies from "./metereologicalBody/list";
import profile from "./profile/update";
import editBody from "./metereologicalBody/update";
import createBody from "./metereologicalBody/create";
import editEquipment from "./equipment/update";
import createEquipment from "./equipment/create";
import stationReads from "./stationReads/list";
import stationReadsUpdate from "./stationReads/update";
import pluviometerReads from "./pluviometerReads/list";
import pluviometerReadsUpdate from "./pluviometerReads/update";
import newsletter from "./newsletter/list";
import newsletterUpdate from "./newsletter/update";
import newsletterCreate from "./newsletter/create";
import cron from "./cron/list";
import cronUpdate from "./cron/update";
import cronCreate from "./cron/create";
import status from "./status/list";
import statusUpdate from "./status/update";
import statusCreate from "./status/create";

export default {
  user,
  profile,
  reads: {
    station: {
      list: stationReads,
      update: stationReadsUpdate,
    },
    pluviometer: {
      list: pluviometerReads,
      update: pluviometerReadsUpdate,
    },
  },
  equipments: {
    list: equipments,
    update: editEquipment,
    create: createEquipment,
  },
  newsletter: {
    list: newsletter,
    update: newsletterUpdate,
    create: newsletterCreate,
  },
  cron: {
    list: cron,
    update: cronUpdate,
    create: cronCreate,
  },
  status: {
    list: status,
    update: statusUpdate,
    create: statusCreate,
  },
  metereologicalBodies: {
    list: metereologicalBodies,
    update: editBody,
    create: createBody,
  },
};
