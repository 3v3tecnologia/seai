import { Modules } from "../../../domain/User/core/model/user-modules-access";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeUserPermissionMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const newsletterPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.NEWSLETTER, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.NEWSLETTER, {
      write: true,
    })
  ),
};

export const userPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.USER, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.USER, {
      write: true,
    })
  ),
};

export const FAQPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.FAQ, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.FAQ, {
      write: true,
    })
  ),
};

export const equipmentsPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.EQUIPMENTS, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.EQUIPMENTS, {
      write: true,
    })
  ),
};

export const cropPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.CROP, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.CROP, {
      write: true,
    })
  ),
};

export const weightsPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.WEIGHTS, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.WEIGHTS, {
      write: true,
    })
  ),
};

export const studiesPermissions = {
  read: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.STUDIES, {
      read: true,
    })
  ),
  write: adaptMiddleware(
    makeUserPermissionMiddleware(Modules.STUDIES, {
      write: true,
    })
  ),
};
