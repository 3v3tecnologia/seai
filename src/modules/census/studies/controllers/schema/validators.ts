import Joi from 'joi'
import { SchemaValidator } from '../../../../../shared/validation/validator';


const createCropStudiesValidator = new SchemaValidator(Joi.object({
    id: Joi.number().required(),
    data: Joi.array().items(Joi.object({
        crop: Joi.string().trim().required(),
        harvest_duration_in_months: Joi.number().integer().required(),
        cultivation_period_in_days: Joi.number().integer().required(),
        consumption: Joi.number().integer().required(),
        productivity: Joi.number().required(),
        year: Joi.number().required()
    })).required()
}))


const getCropStudiesValidator = new SchemaValidator(Joi.object({
    id: Joi.number().required(),
}))

export {
    createCropStudiesValidator,
    getCropStudiesValidator
}