import { CommandController } from "./command.controller";
import { CommandExecutionService } from "@application/services/command-execution.service";

describe("CommandController", () => {
  let commandController: CommandController;
  let commandExecutionService: CommandExecutionService;

  beforeEach(() => {
    commandExecutionService = {
      execute: jest.fn(),
    } as unknown as CommandExecutionService;
    commandController = new CommandController(commandExecutionService);
  });

  it("Should be defined", async () => {
    expect(commandController).toBeDefined();
  });
});
