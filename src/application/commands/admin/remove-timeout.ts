import {
  RemoveTimeoutOptions,
  TimeoutService,
} from "@application/services/timeout.service";
import {
  Command,
  CommandExecutionContext,
  PrefixedCommandExecutionContext,
  SlashCommandExecutionContext,
  SlashCommandOption,
} from "@domain/entities/command";
import { MessageBuilder } from "@templates/message-builder";

export class RemoveTimeoutCommand implements Command {
  public readonly description: string;

  constructor(private readonly _timeoutService: TimeoutService) {
    this.description = "Remove o silêncio de um usuário";
  }

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

  private async handlePrefixedCommand(
    context: PrefixedCommandExecutionContext
  ): Promise<string> {
    const [_, rawUserId] = context.messageContent.split(" ");

    if (!rawUserId) {
      throw new Error("Usuário não informado");
    }

    const userId = rawUserId.replace(/<@!?(\d+)>/, "$1");

    await this._timeoutService.removeTimeout({
      authorId: context.authorId,
      guildId: context.guildId,
      userId,
    });

    return MessageBuilder.unmute({
      userId,
    });
  }

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      const { isSlashCommand, guildId } = context;

      if (!guildId) {
        throw new Error("Esse comando só pode ser executado em um servidor!");
      }

      if (isSlashCommand) {
        return this.handleSlashCommand(context);
      }
      return this.handlePrefixedCommand(context);
    } catch (error: any) {
      console.error(error);
      return `Error: ${error?.message}`;
    }
  }
}
