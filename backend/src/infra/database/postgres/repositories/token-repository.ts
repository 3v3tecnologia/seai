export class UserTokenRepository  {
    private repository:any

    constructor() {
        this.repository=''
    }
    async create({ expires_date, refresh_token, user_id }: any): Promise<any> {
        return 'kajdkajhdkjh2kh1jdasds'
    }
    async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<any> {
        return 'kajdkajhdkjh2kh1jdasds'
    }
    async deleteTokenById(id: string): Promise<void>{
 
    }
    async findByToken(refresh_token: string): Promise<any> {
        return 'kajdkajhdkjh2kh1jdasds'
    }
}