
import { ObjectSchema, ValidationError } from "joi";

interface ValidationResult<T> {
    value: T | null;
    error: ValidationError | null;
}

// export interface schemaValidator<T>(data: T, schema: Joi.ObjectSchema<any>): Promise<ValidationResult<T>>

export async function schemaValidator<T>(data: T, schema: ObjectSchema<any>): Promise<ValidationResult<T>> {
    try {
        const value = await schema.validateAsync(data);
        return { value, error: null };

    } catch (error) {
        return { value: null, error: error as ValidationError };
    }

}

export interface ISchemaValidator {
    validate(data: any): Promise<ValidationResult<any>>
}

export class SchemaValidator implements ISchemaValidator {
    constructor(private readonly schema: ObjectSchema<any>) { }

    async validate(data: any): Promise<ValidationResult<any>> {
        try {
            const value = await this.schema.validateAsync(data);
            return { value, error: null };

        } catch (error) {
            return { value: null, error: error as ValidationError };
        }
    }
}