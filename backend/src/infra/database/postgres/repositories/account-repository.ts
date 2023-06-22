export class AccountRepository {
  async add(data: any): Promise<any> {}

  async loadByEmail(email: string): Promise<any> {}

  async checkByEmail(email: string): Promise<any> {}

  async updateAccessToken(id: string, token: string): Promise<void> {}

  async loadByToken(token: string, role?: string): Promise<any> {
    return {
      id: 1,
      user: "Davi",
      role: "admin",
    };
  }
}
