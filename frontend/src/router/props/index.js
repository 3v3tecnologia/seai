import user from "./user/list";
import equipments from "./equipment/list";
import metereologicalBodies from "./metereologicalBody/list";
import profile from "./profile/update";
import editBody from "./metereologicalBody/update";
import createBody from "./metereologicalBody/create";
import editEquipment from "./equipment/update";
import createEquipment from "./equipment/create";
import stationReads from "./stationReads/list";

export default {
  user,
  reads: {
    station: stationReads,
  },
  equipments,
  metereologicalBodies,
  profile,
  editBody,
  createBody,
  editEquipment,
  createEquipment,
};
