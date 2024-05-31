import Joi from 'joi'
import { SchemaValidator } from '../../../../../shared/validation/validator';


const createIndicatorsWeightsValidator = new SchemaValidator(Joi.object({
    id: Joi.number().required(),
    data: Joi.array().items(Joi.object({
        crop: Joi.string().trim().required(),
        productivity_ha: Joi.number().precision(2).required(),
        productivity_m3: Joi.number().precision(2).required(),
        profitability_ha: Joi.number().precision(2).required(),
        profitability_m3: Joi.number().precision(2).required(),
        jobs_ha: Joi.number().precision(2).required(),
        jobs_1000m3: Joi.number().precision(2).required(),
        water_consumption: Joi.number().precision(2).required(),
        crop_cycle: Joi.number().precision(2).required(),
        year: Joi.number().required()
    })).required()
}))


const getIndicatorsWeightsValidator = new SchemaValidator(Joi.object({
    id: Joi.number().required(),
}))

export {
    createIndicatorsWeightsValidator,
    getIndicatorsWeightsValidator
}