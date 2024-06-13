import Joi from 'joi'
import { SchemaValidator } from '../../../../shared/validation/validator';


const irrigationTypesNames = [
    'Aspersão', 'Microaspersão', 'Gotejamento', 'Pivô Central', 'Sulcos'
];

const systemEfficiencySchema = Joi.object({
    Efficiency: Joi.number().greater(0).optional().default(null)
});

const sprinklingPropsSchema = systemEfficiencySchema.append({
    Precipitation: Joi.number().greater(0).required()
});

const sulcosPropsSchema = systemEfficiencySchema.append({
    Length: Joi.number().greater(0).required(),
    Spacing: Joi.number().greater(0).required(),
    Flow: Joi.number().greater(0).required()
});

const pivotPropsSchema = systemEfficiencySchema.append({
    Precipitation: Joi.number().greater(0).required()
});

const microSprinklingPropsSchema = systemEfficiencySchema.append({
    Flow: Joi.number().greater(0).required(),
    Area: Joi.number().greater(0).required(),
    EfectiveArea: Joi.number().greater(0).required(),
    PlantsQtd: Joi.number().greater(0).integer().required()
});

const drippingPropsSchema = systemEfficiencySchema.append({
    Flow: Joi.number().greater(0).required(),
    Area: Joi.number().greater(0).required(),
    EfectiveArea: Joi.number().greater(0).required(),
    PlantsQtd: Joi.number().greater(0).integer().required()
});

const irrigationParamsSchema = Joi.object({
    Station: Joi.object({
        Id: Joi.number().integer().optional(),
        Et0: Joi.number().greater(0).optional()
    }).optional(),
    Pluviometer: Joi.object({
        Id: Joi.number().integer().optional(),
        Precipitation: Joi.number().greater(0).optional()
    }).optional(),
    CropId: Joi.number().integer().required(),
    PlantingDate: Joi.string().pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/, 'DD/MM/YYYY').required(),
    IrrigationEfficiency: Joi.number().greater(0).optional(),
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