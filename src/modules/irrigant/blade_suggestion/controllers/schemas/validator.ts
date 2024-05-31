import Joi from 'joi'
import { SchemaValidator } from '../../../../../shared/validation/validator';


const irrigationTypesNames = [
    'Aspersão', 'Microaspersão', 'Gotejamento', 'Pivô Central', 'Sulcos'
];

const systemEfficiencySchema = Joi.object({
    Efficiency: Joi.number().optional()
});

const sprinklingPropsSchema = systemEfficiencySchema.append({
    Precipitation: Joi.number().required()
});

const sulcosPropsSchema = systemEfficiencySchema.append({
    Length: Joi.number().required(),
    Spacing: Joi.number().required(),
    Flow: Joi.number().required()
});

const pivotPropsSchema = systemEfficiencySchema.append({
    Precipitation: Joi.number().required()
});

const microSprinklingPropsSchema = systemEfficiencySchema.append({
    Flow: Joi.number().required(),
    Area: Joi.number().required(),
    EfectiveArea: Joi.number().required(),
    PlantsQtd: Joi.number().integer().required()
});

const drippingPropsSchema = systemEfficiencySchema.append({
    Flow: Joi.number().required(),
    Area: Joi.number().required(),
    EfectiveArea: Joi.number().required(),
    PlantsQtd: Joi.number().integer().required()
});

const irrigationParamsSchema = Joi.object({
    Station: Joi.object({
        Id: Joi.number().integer().optional(),
        Et0: Joi.number().optional()
    }).optional(),
    Pluviometer: Joi.object({
        Id: Joi.number().integer().optional(),
        Precipitation: Joi.number().optional()
    }).optional(),
    CropId: Joi.number().integer().required(),
    PlantingDate: Joi.string().isoDate().required(),
    IrrigationEfficiency: Joi.number().required(),
    System: Joi.object({
        Type: Joi.string().valid(...irrigationTypesNames).required(),
        // You will need to define the Measurements schema based on the properties of SulcosProps, PivotProps, etc.
        Measurements: Joi.alternatives().try(
            sulcosPropsSchema,
            pivotPropsSchema,
            drippingPropsSchema,
            microSprinklingPropsSchema,
            sprinklingPropsSchema
        ).required()
    }).required()
});


const bladeSuggestionValidator = new SchemaValidator(irrigationParamsSchema)

export {
    bladeSuggestionValidator
}