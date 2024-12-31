import {
  TimeoutOptions,
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

export class TimeoutCommand implements Command {
  public readonly description: string;

  constructor(private readonly _timeoutService: TimeoutService) {
    this.description = "Silencia um usuário por um tempo determinado.";
  }

  private extractSlashCommandOptions(
    options: SlashCommandOption[]
  ): TimeoutOptions {
    const userId = options.find((opt) => opt.name === "user")?.value;
    const duration = options.find((opt) => opt.name === "duration")?.value;
    const reason = options.find((opt) => opt.name === "reason")?.value;

    if (!userId) {
      throw new Error("O parâmetro 'user' é obrigatório");
    }
    if (!duration) {
      throw new Error("O parâmetro 'duration' é obrigatório");
    }

    return {
      durationInMinutes: duration as number,
      userId: userId as string,
      reason: reason as string,
    };
  }

  private async handleSlashCommand(
    context: SlashCommandExecutionContext
  ): Promise<string> {
    const { authorId, guildId, options } = context;
    const { durationInMinutes, userId, reason } =
      this.extractSlashCommandOptions(options);

    const durationInMs = durationInMinutes * 60 * 1000;

    await this._timeoutService.timeoutUser({
      authorId: authorId,
      guildId: guildId,
      userId: userId,
      duration: durationInMs,
      reason: reason,
    });

    return MessageBuilder.mute({
      userId,
      reason,
      durationInMinutes,
    });
  }

  private async handlePrefixedCommand(
    context: PrefixedCommandExecutionContext
  ): Promise<string> {
    const [_, rawUserId, durationInMinutes, ...reason] =
      context.messageContent.split(" ");

    if (!rawUserId) {
      throw new Error("Usuário não informado");
    }
    if (!durationInMinutes) {
      throw new Error("Duração do timeout não informado");
    }

    const userId = rawUserId.replace(/<@!?(\d+)>/, "$1");
    const durationInMs = parseInt(durationInMinutes, 10) * 60 * 1000;

    await this._timeoutService.timeoutUser({
      userId,
      duration: durationInMs,
      guildId: context.guildId,
      reason: reason.join(" "),
      authorId: context.authorId,
    });

    return MessageBuilder.mute({
      userId,
      reason: reason.join(" "),
      durationInMinutes: parseInt(durationInMinutes, 10),
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
