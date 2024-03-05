import { AuthenticationService } from "../authentication/ports/authentication-service";

export class SignIn {
  private readonly authentication: AuthenticationService;

  constructor(authentication: AuthenticationService) {
    this.authentication = authentication;
  }
  async execute(user: { login: string; password: string }) {
    return await this.authentication.auth(user);
  }
}
