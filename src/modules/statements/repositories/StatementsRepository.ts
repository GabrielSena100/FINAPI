import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { CreateStatementUseCase } from "../useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { ITransferStatementDTO } from "../useCases/transferStatement/ITransferStatementDTO";
import { IStatementsRepository } from "./IStatementsRepository";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const balance = statement.reduce((acc, operation) => {
      const currentValue = `${operation.amount}`;
      if (operation.type === 'deposit') {
        return acc + parseFloat(currentValue);
      } else {
        return acc - parseFloat(currentValue);
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async transfer({userTarget, userSource, amount, description}: ITransferStatementDTO): Promise<Statement> {

    const statement = await this.create({
      user_id: userSource.id as string,
      amount,
      description,
      type: 'transfer' as  OperationType
    });

    return statement;
  }
}
