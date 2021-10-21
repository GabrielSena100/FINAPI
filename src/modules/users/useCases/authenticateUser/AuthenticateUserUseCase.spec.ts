import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
      usersRepositoryInMemory = new InMemoryUsersRepository();
      authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
      createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it("should be able to authenticate an user that already exists", async () => {

        const user: ICreateUserDTO = {
            name : "Jerry Briggs",
            email : "umse@ipezovagi.ec",
            password : "1234"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
          email: user.email,
          password: user.password
        });

        expect(result).toHaveProperty("token");

    });

    it("should not be able to authenticate an nonexistent user", async () => {
      await expect(authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "false"
      })
      ).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

});
