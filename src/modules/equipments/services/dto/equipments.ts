export type MakeStationMeasurements = {
    FK_Equipment: number,
    FK_Organ: number,
    Time: string,
    Hour: number | null,
    TotalRadiation: number | null,
    MaxRelativeHumidity: number | null,
    MinRelativeHumidity: number | null,
    AverageRelativeHumidity: number | null,
    MaxAtmosphericTemperature: number | null,
    MinAtmosphericTemperature: number | null,
    AverageAtmosphericTemperature: number | null,
    AtmosphericPressure: number | null,
    WindVelocity: number | null
}


export type MakePluviometerMeasurements = {
    FK_Equipment: number,
    FK_Organ: number,
    Time: string,
    Hour: number | null,
    Value: number | null
}