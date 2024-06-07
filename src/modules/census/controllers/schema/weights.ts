import Joi from 'joi'
import { SchemaValidator } from '../../../../shared/validation/validator';


const createIndicatorsWeightsValidator = new SchemaValidator(Joi.object({
    basin_ids: Joi.array().items(Joi.number().integer()).required(),
    year: Joi.number().required(),
    data: Joi.array().items(Joi.object({
        basin_mask: Joi.number().required(),
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
}).options({
    abortEarly: false
}))


const getIndicatorsWeightsValidator = new SchemaValidator(Joi.object({
    basin_ids: Joi.array().items(Joi.number().integer()).required(),
    year: Joi.number().required()
}).options({
    abortEarly: false
}))

const calculateIndicatorsWeightsValidator = new SchemaValidator(Joi.object({
    basin_ids: Joi.array().items(Joi.number().integer()).required(),
    area: Joi.number().optional(),
    users_registered_count: Joi.number().integer().optional(),
    crops_names: Joi.array().items(Joi.string()).optional()
}))

export {
    createIndicatorsWeightsValidator,
    getIndicatorsWeightsValidator,
    calculateIndicatorsWeightsValidator
}