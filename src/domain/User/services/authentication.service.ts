import { URL } from "url";
import { GOVERNMENT_WEB_PAGE_BASE_URL, IRRIGANT_WEB_PAGE_BASE_URL } from "../../../server/http/config/url";
import { AuthServiceInput, AuthServiceOutput, IAuthService } from "./protocols/auth";
import { IUserService } from "./protocols/gov-user";
import { IIrrigationUserService } from "./protocols/irrigant-user";

export class AuthService implements IAuthService {
  constructor(
    private readonly govUserService: IUserService,
    private readonly irrigantUserService: IIrrigationUserService,
  ) { }

  async auth({
    login,
    password,
  }: AuthServiceInput, url: string): Promise<AuthServiceOutput> {

    const objectURL = new URL(url)

    if (objectURL.origin === new URL(IRRIGANT_WEB_PAGE_BASE_URL).origin) {
      return this.irrigantUserService.login({
        login,
        password,
      })
    }

    return this.govUserService.login({
      login,
      password,
    })

  }
}
