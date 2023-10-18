export class UserToken {
  get token() {
    return localStorage.getItem("utkn");
  }
  set token(token) {
    localStorage.setItem("utkn", token);
  }
}
