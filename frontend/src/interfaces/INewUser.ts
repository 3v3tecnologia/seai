export default interface INewUser {
  email: string;
  role: string;
  name: string;
  created_at: Date | string;
  status: number;
  id?: number;
}
