import { badRequest, created, serverError } from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { EquipmentsMeasurementsServices } from "../services/measurements";

export class EquipmentsMeasurementsControllers {
    // static async getByEquipmentsCodesAndDate(codes: Array<number>, date: string, eqpType: 'station' | 'pluviometer'): Promise<HttpResponse> {
    //     try {
    //         const codes = 
    //         return created('');
    //     } catch (error) {
    //         console.error(error);
    //         return serverError(error as Error);
    //     }
    // }

    static async bulkUpdate(request: { type: 'station' | 'pluviometer', items: Array<any> }): Promise<HttpResponse> {
        try {
            const successOrError = await EquipmentsMeasurementsServices.bulkUpdate(request.type, request.items)

            if (successOrError.isLeft()) {
                return badRequest(successOrError.value)
            }

            return created(successOrError.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async bulkInsert(request: { type: 'station' | 'pluviometer', items: Array<any> }): Promise<HttpResponse> {
        try {
            const successOrError = await EquipmentsMeasurementsServices.bulkInsert(request.type, request.items)

            if (successOrError.isLeft()) {
                return badRequest(successOrError.value)
            }

            return created(successOrError.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }


}