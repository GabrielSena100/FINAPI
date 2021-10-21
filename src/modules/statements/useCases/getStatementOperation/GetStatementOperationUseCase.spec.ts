import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let getStatementOperationUseCase : GetStatementOperationUseCase;
let createUserUseCase : CreateUserUseCase;
let usersRepository : InMemoryUsersRepository;
let statementRepository : InMemoryStatementsRepository;
let createStatementUseCase : CreateStatementUseCase;

describe("Get Statement Operation", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementRepository);
  });

  it("should be able to get a statement operation", async () => {
    const user = await createUserUseCase.execute({
      name : "Bess Castillo",
      email : "ufiohse@tivoeke.cc",
      password : "1234"
    });

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }


    const statement = await createStatementUseCase.execute({
      user_id : user.id as string,
      type : OperationType.DEPOSIT,
      amount : 100,
      description : "Description"
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id : user.id as string,
      statement_id : statement.id as string
    });

    console.log("statement is");
    console.log(statementOperation);

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation.amount).toEqual(100);
  });

  it("should not be able to get a statement operation if the user or the statement doesn't exist", async () => {

    expect(async () => {
      const statementOperation = await getStatementOperationUseCase.execute({
        user_id : "1234",
        statement_id : "1234"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound || GetStatementOperationError.StatementNotFound);

  })
});
