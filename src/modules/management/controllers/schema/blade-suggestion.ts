import Joi from 'joi'
import { SchemaValidator } from '../../../../shared/validation/validator';


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
    PlantingDate: Joi.string().pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/, 'DD/MM/YYYY').required(),
    IrrigationEfficiency: Joi.number().optional(),
    System: Joi.object({
        Type: Joi.string().valid(...irrigationTypesNames).required(),
        Measurements: Joi.alternatives().conditional('Type', {
            switch: [
                { is: 'Sulcos', then: sulcosPropsSchema },
                { is: 'Pivô Central', then: pivotPropsSchema },
                { is: 'Gotejamento', then: drippingPropsSchema },
                { is: 'Microaspersão', then: microSprinklingPropsSchema },
                { is: 'Aspersão', then: sprinklingPropsSchema }
            ],
            otherwise: Joi.any().forbidden()
        }).required()
    }).required()
}).options({
    abortEarly: false
});




const bladeSuggestionValidator = new SchemaValidator(irrigationParamsSchema)

export {
    bladeSuggestionValidator
}