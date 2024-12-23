import { CommandExecutionContext } from "@domain/entities/command";
import { CommandExecutionService } from "./command-execution.service";

function generateInput(): CommandExecutionContext {
  return {
    authorId: "fake author",
    channelId: "fake channel",
    messageContent: "fake message",
  };
}

describe("CommandExecutionService", () => {
  let sut: CommandExecutionService;
  const fakeCommandName = "fake-command";
  const fakeCommand = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    sut = new CommandExecutionService();
  });

  it("Should be able to execute a command", async () => {
    const messageContext = generateInput();
    const fakeResultData = "fakeResultData";

    fakeCommand.execute.mockResolvedValueOnce(fakeResultData);
    sut.registerCommand(fakeCommandName, fakeCommand);

    const result = await sut.execute(fakeCommandName, messageContext);

    expect(fakeCommand.execute).toHaveBeenCalled();
    expect(result).toEqual(fakeResultData);
  });

  it("Should throw an error if the command does not exist", async () => {
    const messageContext = generateInput();

    await expect(
      sut.execute(fakeCommandName, messageContext)
    ).rejects.toThrowError(`Command "${fakeCommandName}" not found.`);
  });
});
