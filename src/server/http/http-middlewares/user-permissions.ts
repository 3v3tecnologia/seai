import { Modules } from "../../../domain/entities/user/user-modules-access";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAdminMiddleware } from "../factories/middlewares/admin-middleware-factory";

export const needNewsletterReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.NEWSLETTER, {
    read: true,
  })
);

export const needNewsletterWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.NEWSLETTER, {
    write: true,
  })
);

export const needUserReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.USER, {
    read: true,
  })
);

export const needUserWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.USER, {
    write: true,
  })
);

export const needFAQReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.FAQ, {
    read: true,
  })
);

export const needFAQWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.FAQ, {
    write: true,
  })
);
export const needEquipmentsReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.EQUIPMENTS, {
    read: true,
  })
);

export const needEquipmentsWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.EQUIPMENTS, {
    write: true,
  })
);

export const needCropReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.CROP, {
    read: true,
  })
);

export const needCropWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.CROP, {
    write: true,
  })
);

export const needWeightsReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.WEIGHTS, {
    read: true,
  })
);

export const needWeightsWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.WEIGHTS, {
    write: true,
  })
);

export const needStudiesReadPermission = adaptMiddleware(
  makeAdminMiddleware(Modules.STUDIES, {
    read: true,
  })
);

export const needStudiesWritePermission = adaptMiddleware(
  makeAdminMiddleware(Modules.STUDIES, {
    write: true,
  })
);
