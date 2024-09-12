import { Either, left, right } from "../../../../shared/Either";
import { UserModuleAccessErrors } from "../errors/invalid-user-permissions";
import { Modules, SystemModules } from "./user-modules-access";

type existsModules = Array<{
  id: number;
  name: string;
}>;

export function checkIfModulesNotExists(
  new_modules: SystemModules,
  existing_modules: existsModules
): Either<UserModuleAccessErrors.InvalidUserPermissionError, void> {
  const new_modules_list = [
    new_modules.value[Modules.NEWSLETTER],
    new_modules.value[Modules.CROP],
    new_modules.value[Modules.USER],
    new_modules.value[Modules.EQUIPMENTS],
    new_modules.value[Modules.NEWSLETTER],
    new_modules.value[Modules.STUDIES],
    new_modules.value[Modules.WEIGHTS],
  ];
  // evitar ter que salvar usuário com módulos que não existem
  new_modules_list.forEach((module) => {
    if (
      existing_modules.some(
        (module_access) => module_access.id === module.id
      ) === false
    ) {
      return left(
        new UserModuleAccessErrors.InvalidUserPermissionError(
          `Módulo ${module.id} não foi encontrado`
        )
      );
    }
  });

  return right();
}
