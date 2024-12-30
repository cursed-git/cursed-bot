import { TimeoutService } from "@application/services/timeout-service";
import { Command, CommandExecutionContext } from "@domain/entities/command";

export class TimeoutCommand implements Command {
  constructor(private readonly _timeoutService: TimeoutService) {}

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      const { messageContent, guildId, authorId } = context;

      if (!guildId) {
        return "Esse comando só pode ser executado em um servidor.";
      }

      const [_, rawUserId, durationInMinutes, ...reason] =
        messageContent.split(" ");

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
