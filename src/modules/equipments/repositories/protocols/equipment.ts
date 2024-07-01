export interface IEquipmentsRepository {
  insertLastUpdatedAtByOrgan(organId: number): void;
  getDateOfLastMeasurementTaken(): Promise<null | Array<{
    Time: string;
    Id_Organ: number;
  }>>;
  getTypes(): Promise<
    Array<{
      Type: string;
      Name: number;
    }>
  >;
  getOrganByName(organName: string): Promise<{
    Id: number;
    Host: string | null;
    User: string | null;
    Password: string | null;
  } | null>;
  getByType(type: string): Promise<
    Array<{
      IdEquipmentExternal: string;
      Name: string;
      Altitude: number | null;
      Location: {
        Latitude: number;
        Longitude: number;
      } | null;
      FK_Organ: number;
      FK_Type: number;
      Enabled: number;
    }>
  >;
  bulkInsert(
    equipments: Array<any>
  ): Promise<Array<{ Code: string; Id: number }>>;
  getStationCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<any>;
  getPluviometersCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<any>;
  getEquipments(organName: string, eqpType: string): Promise<any>;
}
