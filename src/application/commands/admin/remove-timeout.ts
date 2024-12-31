import {
  RemoveTimeoutOptions,
  TimeoutService,
} from "@application/services/timeout.service";
import {
  Command,
  CommandExecutionContext,
  SlashCommandExecutionContext,
  SlashCommandOption,
} from "@domain/entities/command";
import { MessageBuilder } from "@templates/message-builder";

export class RemoveTimeoutCommand implements Command {
  constructor(private readonly _timeoutService: TimeoutService) {}

  private extractSlashCommandOptions(
    options: SlashCommandOption[]
  ): RemoveTimeoutOptions {
    const userId = options.find((opt) => opt.name === "user")?.value;

    if (!userId) {
      throw new Error("O parâmetro 'user' é obrigatório");
    }

    return {
      userId: userId as string,
    };
  }

  private async handleSlashCommand(
    context: SlashCommandExecutionContext
  ): Promise<string> {
    const { authorId, guildId, options } = context;
    const { userId } = this.extractSlashCommandOptions(options);

    await this._timeoutService.removeTimeout({
      authorId: authorId,
      guildId: guildId,
      userId: userId,
    });

    return MessageBuilder.unmute({
      userId,
    });
  }

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      const { isSlashCommand, guildId, authorId } = context;

      if (!guildId) {
        throw new Error("Esse comando só pode ser executado em um servidor!");
      }

      if (isSlashCommand) {
        return this.handleSlashCommand(context);
      }

      const [_, rawUserId] = context.messageContent.split(" ");
      const userId = rawUserId.replace(/<@!?(\d+)>/, "$1");

      await this._timeoutService.removeTimeout({
        authorId,
        guildId,
        userId,
      });

      return `Usuário <@${userId}> foi desmutado.`;
    } catch (error: any) {
      console.error(error);
      return `Error: ${error?.message}`;
    }
  }
}
