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

export default {
  user,
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
  equipments,
  metereologicalBodies,
  profile,
  editBody,
  createBody,
  editEquipment,
  createEquipment,
};
