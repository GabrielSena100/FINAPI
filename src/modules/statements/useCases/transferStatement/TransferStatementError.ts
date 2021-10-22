import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementError {
  export class UserTargetNotFound extends AppError {
    constructor() {
      super('User Target not found', 404);
    }
  }

  export class UserSourceNotFound extends AppError {
    constructor() {
      super('User Source not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
