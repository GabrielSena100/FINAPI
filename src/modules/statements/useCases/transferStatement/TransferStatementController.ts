import { Request, Response } from 'express';


class TransferStatementController {
  async execute(request: Request, response: Response): Promise<Response> {

    const {user_id : idUserTarget  } = request.params;
    const { id: idUserSource } = request.user;
    const { amount, description } = request.body;



    return response.status(200).send();
  }
}

export {TransferStatementController}
