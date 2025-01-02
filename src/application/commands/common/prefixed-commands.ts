import { CommandExecutionService } from "@application/services/command-execution.service";
import { Command } from "@domain/entities/command";
import { ENVS } from "@infra/config/config";

export class ListPrefixedCommandsCommand implements Command {
  public readonly description: string;

  constructor(
    private readonly _commandExecutionService: CommandExecutionService
  ) {
    this.description = "Lista todos os comandos prefixados do Cursed Bot";
  }

  public async execute(): Promise<string> {
    const commandsMap = this._commandExecutionService.getCommands();
    const aliasesMap = this._commandExecutionService.getAliases();

    console.debug(commandsMap, aliasesMap);

    let commandsListText = "**✨ Lista de Comandos Prefixados ✨**\n\n";

    commandsMap.forEach((value, commandName) => {
      if (aliasesMap.has(commandName)) {
        commandsListText += `\`${ENVS.BOT_PREFIX}${commandName}\` - ${value.description}`;

        const commandAliases = aliasesMap.get(commandName);
        if (commandAliases && commandAliases.length > 0) {
          commandsListText += `. **Sinônimos**: ${commandAliases
            .map((alias) => `\`${ENVS.BOT_PREFIX}${alias}\``)
            .join(", ")}`;
        }

        commandsListText += ";\n";
      }
    });

    return commandsListText;
  }
}
