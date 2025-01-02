import { ListCommandsService } from "@application/services/list-commands.service";
import { Command } from "@domain/entities/command";
import { MessageBuilder } from "@templates/message-builder";

export class ListCommandsCommand implements Command {
  public readonly description: string;

  constructor(private readonly _listCommandsService: ListCommandsService) {
    this.description = "Lista todos os comandos disponíveis";
  }

  public async execute(): Promise<string> {
    try {
      const slashCommandsList = await this._listCommandsService.listCommands();

      return MessageBuilder.commandsList(slashCommandsList);
    } catch (error: any) {
      console.error(error);
      return `Error: ${error?.message}`;
    }
  }
}
