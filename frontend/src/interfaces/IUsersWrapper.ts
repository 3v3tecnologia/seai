import INewUser from "./INewUser";

export default interface IUsersWrapper {
  data: INewUser[];
  totalAdmins: number;
  totalBasics: number;
  totalActives: number;
  totalInactives: number;
}
