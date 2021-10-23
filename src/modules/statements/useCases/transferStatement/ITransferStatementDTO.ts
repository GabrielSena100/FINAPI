import { User } from "../../../users/entities/User";

export interface ITransferStatementDTO {
  userTarget: User;
  userSource: User;
  amount: number;
  description: string;
}
