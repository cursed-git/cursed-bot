import {
  TimeoutOptions,
  TimeoutService,
} from "@application/services/timeout.service";
import {
  Command,
  CommandExecutionContext,
  SlashCommandExecutionContext,
  SlashCommandOption,
} from "@domain/entities/command";
import { MessageBuilder } from "@templates/message-builder";

export class TimeoutCommand implements Command {
  constructor(private readonly _timeoutService: TimeoutService) {}

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

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      const { isSlashCommand, guildId, authorId } = context;

      if (!guildId) {
        throw new Error("Esse comando só pode ser executado em um servidor!");
      }

      if (isSlashCommand) {
        return this.handleSlashCommand(context);
      }

      const [_, rawUserId, durationInMinutes, ...reason] =
        context.messageContent.split(" ");

      const userId = rawUserId.replace(/<@!?(\d+)>/, "$1");
      const durationInMs = parseInt(durationInMinutes) * 60 * 1000;

      await this._timeoutService.timeoutUser({
        userId,
        duration: durationInMs,
        guildId,
        reason: reason.join(" "),
        authorId,
      });

      return `Usuário <@${userId}> foi silenciado por ${durationInMinutes} minutos.`;
    } catch (error: any) {
      console.error(error);
      return `Error: ${error?.message}`;
    }
  }
}
