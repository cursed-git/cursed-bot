import { TimeoutService } from "@application/services/timeout-service";
import { Command, CommandExecutionContext } from "@domain/entities/command";

export class RemoveTimeoutCommand implements Command {
  constructor(private readonly _timeoutService: TimeoutService) {}

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      const { messageContent, guildId, authorId } = context;

      if (!guildId) {
        return "Esse comando só pode ser executado em um servidor.";
      }

      const [_, rawUserId] = messageContent.split(" ");
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
