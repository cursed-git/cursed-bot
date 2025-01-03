import { SlashCommandManagerService } from "@application/services/slash-command-manager.service";
import { Command, CommandExecutionContext } from "@domain/entities/command";
import { ENVS } from "@infra/config/config";

export class LoadCommandsCommand implements Command {
  public readonly description: string;
  public readonly isPrivate?: boolean | undefined;

  public constructor(
    private readonly _slashCommandManager: SlashCommandManagerService
  ) {
    this.description = "Carrega globalmente todos os slash commands do bot";
    this.isPrivate = true;
  }

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      if (ENVS.DEV_MODE && context.authorId == ENVS.DISCORD_DEV_MODE_USER) {
        await this._slashCommandManager.loadCommands();

        return "Slash commands carregados com sucesso!";
      }

      return "Você não está autorizado a utilizar esse comando!";
    } catch (error: any) {
      return `Erro ao carregar os comandos: ${error.message}`;
    }
  }
}
