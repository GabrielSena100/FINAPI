import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepositoryInMemory : InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {

    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to show the user profile for an existent user", async () => {
    const user: ICreateUserDTO = {
      name: "Lora Kelly",
      email: "lo@mowdobov.au",
      password: "1234"
    };

    //const createdUser = await usersRepository.create({name: user.name, email: user.email, password: user.password});
    const createdUser = await createUserUseCase.execute(user);
    const user_id = createdUser.id as string;

    const userProfile = await showUserProfileUseCase.execute(user_id);

    expect(userProfile).toHaveProperty("name");
    expect(userProfile.name).toEqual(user.name);
    expect(userProfile.email).toEqual(user.email);

  });

  it("should not be able to show the user profile if an user doesn't exist!", async () => {

    const user = {
      name: "Ronnie Washington",
      email: "hu@lu.tp",
      password: "123456",
      user_id: "11111111"
    };

    await expect(
      showUserProfileUseCase.execute(user.user_id)
    ).rejects.toEqual(new ShowUserProfileError());

  })
})
