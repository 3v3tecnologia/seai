export type StationMeasurementsToPersist = {
  FK_Equipment: number;
  FK_Organ: number;
  Time: string;
  Hour: number | null;
  Altitude: number | null;
  Longitude: number | null;
  Latitude: number | null;
  TotalRadiation: number | null;
  MaxRelativeHumidity: number | null;
  MinRelativeHumidity: number | null;
  AverageRelativeHumidity: number | null;
  MaxAtmosphericTemperature: number | null;
  MinAtmosphericTemperature: number | null;
  AverageAtmosphericTemperature: number | null;
  AtmosphericPressure: number | null;
  WindVelocity: number | null;
  Et0?: number | null;
};

export type PluviometerMeasurementsToPersist = {
  FK_Equipment: number;
  FK_Organ: number;
  Time: string;
  Hour: number | null;
  Altitude: number | null;
  Longitude: number | null;
  Latitude: number | null;
  Precipitation: number | null;
};

export interface IEquipmentsMeasurementsRepository {
  checkIfUserStationHasYesterdayEtoMeasurements(
    user_id: number
  ): Promise<boolean>;
  getLastMeasurementsFromStation(
    idStation: number,
    date: string
  ): Promise<null | { Time: Date; Et0: number }>;
  getLastMeasurementsFromPluviometer(
    idPluviometer: number
  ): Promise<null | { Time: Date; Precipitation: number }>;
  insertStations(measurements: Array<any>): Promise<Array<number>>;
  bulkInsert(
    measurements: Array<
      StationMeasurementsToPersist | PluviometerMeasurementsToPersist
    >,
    type: "station" | "pluviometer"
  ): Promise<Array<number>>;
  bulkUpdate(
    measurements: Array<any>,
    type: "station" | "pluviometer"
  ): Promise<void>;
  getStationCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<Array<string>>;
  getPluviometersCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<Array<string>>;
  getMeasurementsIdsByTime(
    time: string,
    type: "station" | "pluviometer",
    id_organ: number
  ): Promise<Map<number, number>>;
}
