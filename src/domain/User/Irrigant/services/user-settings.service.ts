import { Either, left, right } from "../../../../shared/Either";
import { NewsletterServiceProtocol } from "../../../Newsletter/services/newsletter.service.protocol";
import { IrrigationUserRepositoryProtocol } from "../infra/repositories/protocol/irrigation-user.repository";
import { IUserPreferencesRepository } from "../infra/repositories/protocol/preferences.repository";

import {
  GetUserNotificationsPreferencesOutputDTO,
  SaveUserEquipmentsDTO,
  UpdateUserEquipmentsDTO,
  UpdateUserPreferencesDTO,
} from "./dto/user-settings";
import { IUserPreferencesServices } from "./protocols/user-settings";

export class UserSettingsServices implements IUserPreferencesServices {
  constructor(
    private repository: IUserPreferencesRepository,
    private readonly accountRepository: IrrigationUserRepositoryProtocol,
    private readonly newsletterService: NewsletterServiceProtocol,
  ) { }

  //Associate equipments to User
  // The user is allowed to have only 2 equipments
  async saveEquipments(
    dto: SaveUserEquipmentsDTO
  ): Promise<Either<Error, string>> {
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.removeEquipments(dto.UserId);

    // Save user equipments
    // Should get all activated equipments
    await this.repository.associateEquipmentsToUser({
      user_id: dto.UserId,
      pluviometer_id: dto.PluviometerId,
      station_id: dto.StationId,
    });

    return right("Sucesso ao salvar equipamentos");
  }
  async deleteEquipments(user_id: number): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.removeEquipments(user_id);

    return right();
  }
  async updateEquipments(
    dto: UpdateUserEquipmentsDTO
  ): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.updateEquipments({
      user_id: dto.UserId,
      station_id: dto.StationId,
      pluviometer_id: dto.PluviometerId,
    });

    return right();
  }
  // Get user's equipments
  async getEquipments(user_id: number): Promise<Either<Error, Array<any>>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    return right(await this.repository.getUsersEquipments(user_id));
  }

  // Get user's equipments
  async getNotifications(user_id: number): Promise<Either<Error, Array<any>>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    return right(await this.repository.getUsersEquipments(user_id));
  }

  async updateUserNotificationPreference(
    dto: UpdateUserPreferencesDTO
  ): Promise<Either<Error, void>> {
    const availableNotificationsService =
      await this.repository.getAvailableNotificationsServicesById(
        dto.ServiceId
      );

    if (availableNotificationsService === null) {
      return left(new Error("Serviço de notificação não encontrado"));
    }


    if (availableNotificationsService.service == "newsletter") {
      const userAccount = await this.accountRepository.getUserById(dto.UserId);
      if (dto.Enabled) {
        await this.newsletterService.unsubscribe(userAccount!.email);
        const successOrError = await this.newsletterService.subscribe(userAccount!.email);

        if (successOrError.isLeft()) return left(successOrError.value);
      } else {
        const successOrError = await this.newsletterService.unsubscribe(userAccount!.email);
        if (successOrError.isLeft()) return left(successOrError.value);
      }
    }
    // If the user enable newsletter notification then should to add user email to newsletter subscriber
    await this.repository.updateUserNotificationPreference({
      service_id: dto.ServiceId,
      user_id: dto.UserId,
      enabled: dto.Enabled,
    });

    return right();
  }

  async removeUserNotificationsPreferences(
    user_id: number,
    email: string
  ): Promise<Either<Error, void>> {
    await this.repository.removeUserNotificationsPreferences(user_id);

    await this.newsletterService.unsubscribe(email);

    return right();
  }

  async createUserNotificationsPreferences(
    input: Array<{ user_id: number; service_id: number; enabled: boolean }>
  ): Promise<Either<Error, void>> {
    await this.repository.createUserNotificationsPreferences(input);

    return right();
  }

  async getAvailableNotificationsServices(): Promise<Array<any> | null> {
    return await this.repository.getAvailableNotificationsServices();
  }

  async getUserNotificationsPreferences(
    user_id: number
  ): Promise<GetUserNotificationsPreferencesOutputDTO> {
    return right(
      await this.repository.getUserNotificationsPreferences(user_id)
    );
  }
}
