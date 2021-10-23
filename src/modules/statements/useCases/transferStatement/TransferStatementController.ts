import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { TransferStatementUseCase } from './TransferStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

class TransferStatementController {
  async execute(request: Request, response: Response): Promise<Response> {

    const {user_id : idUserTarget  } = request.params;
    const { id: idUserSource } = request.user;
    const { amount, description } = request.body;

    const transferStatement = await container.resolve(TransferStatementUseCase);

    const transfer = await transferStatement.execute({idUserTarget, idUserSource, amount, description});

    const createStatement = await container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id: idUserSource,
      type: 'transfer' as OperationType,
      amount,
      description: description
    });

    return response.json(statement);
  }
}

export {TransferStatementController}
