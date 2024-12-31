import { CommandExecutionService } from "@application/services/command-execution.service";
import { CommandExecutionContext } from "@domain/entities/command";

export class CommandController {
  constructor(
    private readonly _commandExecutionService: CommandExecutionService
  ) {}

  public async handle(context: CommandExecutionContext): Promise<string> {
    try {
      const { commandName } = context;

      return await this._commandExecutionService.execute(commandName, context);
    } catch (error: any) {
      return `Error: ${error?.message}`;
    }
  }
}
