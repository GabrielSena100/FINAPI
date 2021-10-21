import exp from "constants";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase : GetBalanceUseCase;
let statementsRepository : InMemoryStatementsRepository;
let usersRepository : InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository);
  });

  it("should be able to get the balance", async () => {

    const user = await createUserUseCase.execute({
      name : "Bess Castillo",
      email : "ufiohse@tivoeke.cc",
      password : "1234"
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id : user.id as string
    });

    expect(getBalance).toHaveProperty("statement");
    expect(getBalance.balance).toEqual(0);
  });

  it("should not be able to get the balance if the user doesn't exist", async () => {
    expect(async () => {
      const getBalance = await getBalanceUseCase.execute({
        user_id : "1234"
      });

    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
