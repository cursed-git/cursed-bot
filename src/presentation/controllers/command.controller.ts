import { CommandExecutionService } from "@application/services/command-execution.service";
import { CommandExecutionContext } from "@domain/entities/command";

export class CommandController {
  constructor(
    private readonly _commandExecutionService: CommandExecutionService
  ) {}

  public async handle(context: CommandExecutionContext): Promise<string> {
    const { messageContent } = context;
    const [commandName] = messageContent.slice(1).split(" "); // Remove o prefixo '!' e obtém o comando

    try {
      return await this._commandExecutionService.execute(commandName, context);
    } catch (error: any) {
      return `Error: ${error?.message}`;
    }
  }
}
