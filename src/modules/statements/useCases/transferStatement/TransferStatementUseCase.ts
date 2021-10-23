import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferStatementDTO } from "./ITransferStatementDTO";
import { TransferStatementError } from "./TransferStatementError";

interface IRequest {
  idUserTarget: string;
  idUserSource: string;
  amount: number;
  description: string;
}

interface IResponse {
  statement: Statement;
}


@injectable()
class TransferStatementUseCase {

  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ){}

  async execute({idUserTarget, idUserSource, amount, description}: IRequest): Promise<Statement>{

    const userSource = await this.usersRepository.findById(idUserSource);

    if(!userSource){
      throw new TransferStatementError.UserSourceNotFound();
    }

    const userTarget = await this.usersRepository.findById(idUserTarget);

    if(!userTarget){
      throw new TransferStatementError.UserTargetNotFound();
    }

    const {balance} = await this.statementsRepository.getUserBalance(
      { user_id: userSource.id as string,
        with_statement: false});


    if(balance < amount){
      throw new TransferStatementError.InsufficientFunds;
    }

    const data: ITransferStatementDTO = {
      userSource,
      userTarget,
      amount,
      description
    }

    const transferStatement = await this.statementsRepository.transfer(data);

    return transferStatement;

  }
}

export {TransferStatementUseCase}
