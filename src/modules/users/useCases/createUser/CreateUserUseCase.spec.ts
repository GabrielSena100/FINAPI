import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {

    const user = await createUserUseCase.execute({
      name: "test1",
      email: "test1@gmail.com",
      password: "1234"
    });

    expect(user).toHaveProperty("name");
    expect(user.name).toEqual("test1");
    expect(user).toHaveProperty("email");
    expect(user.email).toEqual("test1@gmail.com");

  });

  it("should not be able to create a user that already exists", async () => {

      expect(async () => {
        const user = createUserUseCase.execute({
          name: "test1",
          email: "test1@gmail.com",
          password: "1234"
        });
      }).rejects.toBeInstanceOf(CreateUserError);
  });

});
