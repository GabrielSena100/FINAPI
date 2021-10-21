


import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import {CreateStatementUseCase} from "./CreateStatementUseCase";

import {ICreateStatementDTO} from "./ICreateStatementDTO";

let createStatementUseCase : CreateStatementUseCase;
let statementsRepository : InMemoryStatementsRepository;
let usersRepository : InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;

describe("Create Statement", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
      );
  });

  it("should be able to create new statement", async () => {

    const user : ICreateUserDTO = {
      name : "Carrie McGee",
      email : "bu@geknu.mn",
      password : "1234"
    };

    const userCreated = await createUserUseCase.execute(user);

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const statement : ICreateStatementDTO = {
      user_id : userCreated.id as string,
      type : OperationType.DEPOSIT,
      amount : 100,
      description : "Description"
    };

    const statementOperation = await createStatementUseCase.execute({
      user_id: statement.user_id,
      type : statement.type,
      amount : statement.amount,
      description : statement.description
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.user_id).toEqual(userCreated.id);

  });

  it("should not be able to create a statement if the user doesn't exist", async () => {

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const statement : ICreateStatementDTO = {
      user_id : "123456",
      type : OperationType.DEPOSIT,
      amount : 100,
      description : "Description"
    };

    await expect(async () => {

      const statementOperation = await createStatementUseCase.execute({
        user_id: statement.user_id,
        type : statement.type,
        amount : statement.amount,
        description : statement.description
      });

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound || CreateStatementError.InsufficientFunds);

  });

});
