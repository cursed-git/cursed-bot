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

  it("should execute command successfully", async () => {
    const context: any = { messageContent: "!test" };
    (commandExecutionService.execute as jest.Mock).mockResolvedValue("Success");

    const result = await commandController.handle(context);

    expect(result).toBe("Success");
    expect(commandExecutionService.execute).toHaveBeenCalledWith(
      "test",
      context
    );
  });

  it("should return error message when command execution fails", async () => {
    const context: any = { messageContent: "!test" };
    (commandExecutionService.execute as jest.Mock).mockRejectedValue(
      new Error("Execution failed")
    );

    const result = await commandController.handle(context);

    expect(result).toBe("Error: Execution failed");
    expect(commandExecutionService.execute).toHaveBeenCalledWith(
      "test",
      context
    );
  });

  it("should handle commands with arguments", async () => {
    const context: any = { messageContent: "!test arg1 arg2" };
    (commandExecutionService.execute as jest.Mock).mockResolvedValue(
      "Success with args"
    );

    const result = await commandController.handle(context);

    expect(result).toBe("Success with args");
    expect(commandExecutionService.execute).toHaveBeenCalledWith(
      "test",
      context
    );
  });

  it("should handle empty command", async () => {
    const context: any = { messageContent: "!" };
    (commandExecutionService.execute as jest.Mock).mockResolvedValue(
      "No command"
    );

    const result = await commandController.handle(context);

    expect(result).toBe("No command");
    expect(commandExecutionService.execute).toHaveBeenCalledWith("", context);
  });
});
