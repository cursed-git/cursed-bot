import { CommandExecutionService } from "@application/services/command-execution.service";
import { Command } from "@domain/entities/command";

export class HelpCommand implements Command {
  public readonly description: string;

  constructor(
    private readonly _commandExecutionService: CommandExecutionService
  ) {
    this.description = "Lista todos os comandos do Cursed Bot.";
  }

  public async execute(): Promise<string> {
    const commands = this._commandExecutionService.getCommands();

    let commandsListText = "";
    commands.forEach((value, commandName) => {
      commandsListText += `- \`${commandName}\`: ${value.description}\n`;
    });

    return commandsListText;
  }
}
