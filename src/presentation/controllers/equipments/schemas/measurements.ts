import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import {
  idSchema,
  UserOperationDescriptionSchema,
} from "../../../utils/schemas";

const stationMeasurementsSchema = Joi.object({
  TotalRadiation: Joi.number().min(50).max(400),

  AverageRelativeHumidity: Joi.number().min(5).max(100).required(),
  MinRelativeHumidity: Joi.number().min(5).max(100).required(),
  MaxRelativeHumidity: Joi.number().min(5).max(100).required(),

  AverageAtmosphericTemperature: Joi.number().min(0).max(60).required(),
  MaxAtmosphericTemperature: Joi.number().min(0).max(60).required(),
  MinAtmosphericTemperature: Joi.number().min(0).max(60).required(),

  AtmosphericPressure: Joi.number().min(500).max(1200).required(),

  WindVelocity: Joi.number().min(0.5).max(20).required(),
});

const pluviometerMeasurementsSchema = Joi.object({
  Precipitation: Joi.number().greater(0).required(),
});

const updateStationMeasurements = new SchemaValidator(
  stationMeasurementsSchema
    .append(idSchema)
    .append(UserOperationDescriptionSchema)
    .options({
      abortEarly: false,
    })
);

const updatePluviometerMeasurements = new SchemaValidator(
  pluviometerMeasurementsSchema
    .append(idSchema)
    .append(UserOperationDescriptionSchema)
    .options({
      abortEarly: false,
    })
);

const updatePluviometer = new SchemaValidator(
  Joi.object({
    id: Joi.number().greater(0).required(),
    Enable: Joi.boolean().required(),
  })
);

export {
  updateStationMeasurements,
  updatePluviometerMeasurements,
  updatePluviometer,
};
