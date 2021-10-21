import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let usersRepository : InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    const showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show the user profile for an existent user", async () => {
    const user: ICreateUserDTO = {
      name: "Lora Kelly",
      email: "lo@mowdobov.au",
      password: "1234"
    };

    const createdUser = await usersRepository.create({name: user.name, email: user.email, password: user.password});
    console.log("createdUser");
    console.log(createdUser);
    const user_id = createdUser.id as string;

    const userProfile = await showUserProfileUseCase.execute(user_id);

    expect(userProfile).toBe(User);


  })
})
