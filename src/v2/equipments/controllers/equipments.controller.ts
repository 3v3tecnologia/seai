import {
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";


export class ManagementCropControllers {
  static async getByType(params: {
    type: 'station' | 'pluviometer';
  }): Promise<HttpResponse> {
    try {
      return created('');
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
