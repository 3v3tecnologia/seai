import Joi from 'joi'
import { SchemaValidator } from '../../../../shared/validation/validator';

const stationMeasurementsSchema = Joi.object({
  TotalRadiation: Joi.number().min(50).max(400),

  AverageRelativeHumidity: Joi.number().min(5).max(100).required(),
  MinRelativeHumidity: Joi.number().min(5).max(100).required(),
  MaxRelativeHumidity: Joi.number().min(5).max(100).required(),

  AverageAtmosphericTemperature: Joi.number().min(0).max(60).required(),
  MaxAtmosphericTemperature: Joi.number().min(0).max(60).required(),
  MinAtmosphericTemperature: Joi.number().min(0).max(60).required(),

  AtmosphericPressure: Joi.number().min(500).max(1200).required(),

  WindVelocity: Joi.number().min(0.5).max(20).required()
})

const pluviometerMeasurementsSchema = Joi.object({
  Precipitation: Joi.number().greater(0).required(),
})

const updateStationMeasurements = new SchemaValidator(stationMeasurementsSchema.append({
  id: Joi.number().greater(0).required()
}).options({
  abortEarly: false
}))

const updatePluviometerMeasurements = new SchemaValidator(pluviometerMeasurementsSchema.append({
  id: Joi.number().greater(0).required()
}).options({
  abortEarly: false
}))

const updatePluviometer = new SchemaValidator(Joi.object({
  id: Joi.number().greater(0).required(),
  Enable: Joi.boolean().required(),
}))

const updateEt0 = new SchemaValidator(Joi.object({
  id: Joi.number().greater(0).required(),
  Measurements: Joi.boolean().required(),
}))

const updatePrecipitation = new SchemaValidator(Joi.object({
  id: Joi.number().greater(0).required(),
  Precipitation: Joi.boolean().required(),
}))

export {
  updateStationMeasurements,
  updatePluviometerMeasurements,
  updatePluviometer
}
