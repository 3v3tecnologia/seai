import { Either } from "../../../../shared/Either";
import { IrrigationSystemMeasurementsTypes, IrrigationSystemTypes } from "../../core/model/irrigation-system";



export namespace SaveUserEquipmentsDTO {
    export type Input = {
        UserId: number;
        StationId: number;
        PluviometerId: number;
    }

    export type Output = Promise<Either<Error, void>>
}

export namespace UpdateUserEquipmentsDTO {
    export type Input = {
        UserId: number;
        StationId: number;
        PluviometerId: number;
    }

    export type Output = Promise<Either<Error, void>>
}



export namespace SaveIrrigationCropsDTO {
    // StationId: number;
    // PluviometerId: number;
    export type Input = {
        UserId: number;
        CropId: number;
        PlantingDate: string;
        IrrigationEfficiency: number;
        System: {
            Type: IrrigationSystemTypes;
            Measurements: IrrigationSystemMeasurementsTypes;
        };
    }

    export type Output = Promise<Either<Error, any | null>>
}

export namespace DeleteIrrigationCropsDTO {
    export type Input = {
        id: number
    }
    export type Output = Promise<Either<Error, any | null>>
}

export namespace GetIrrigationCropsByIdDTO {
    export type Input = {
        id: number
    }

    export type Output = Promise<Either<Error, any | null>>
}


export namespace GetAllIrrigationCropsByUserIdDTO {
    export type Input = {
        id: number
    }

    export type Output = Promise<Either<Error, any | null>>
}

export namespace CalcIrrigationRecommendationDTO {
    export type Input = {
        Station: {
            Id?: number;
            Et0?: number;
        };
        Pluviometer: {
            Id?: number;
            Precipitation?: number;
        };
        CropId: number;
        PlantingDate: string;
        IrrigationEfficiency?: number;
        System: {
            Type: IrrigationSystemTypes;
            Measurements: IrrigationSystemMeasurementsTypes;
        };
    };

    export type Output = Promise<Either<Error, any | null>>;
}
