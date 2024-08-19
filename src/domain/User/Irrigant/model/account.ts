export type IrrigationUserProps = {
  id: number;
  name: string;
  code: string;
  status: "pending" | "registered";
  login: string;
  email: string;
  password?: string;
  updatedAt?: string;
  createdAt?: string;
};
