import { SlashCommand } from "@domain/entities/slash-command";

type MuteMessageParams = {
  userId: string;
  durationInMinutes: number;
  reason?: string;
};

type UnmuteMessageParams = {
  userId: string;
};

type PingMessageParams = {
  websocketPing: number;
};

export class MessageBuilder {
  public static mute(params: MuteMessageParams): string {
    const baseMessage = `Usuário <@${params.userId}> foi silenciado por ${params.durationInMinutes} minutos.`;

    if (params.reason) {
      return `${baseMessage}\n**Motivo:** _${params.reason}_`;
    }

    return baseMessage;
  }

  public static unmute(params: UnmuteMessageParams): string {
    return `Usuário <@${params.userId}> foi desmutado.`;
  }

  public static ping(params: PingMessageParams): string {
    return `🏓 **Pong!**\nLatência do WebSocket: \`${params.websocketPing}ms\``;
  }

  public static commandsList(commands: SlashCommand[]): string {
    const slashCommandsProps = commands.map((command) => command.toJSON());

    const message = slashCommandsProps.reduce((acc, command) => {
      return acc + `\`/${command.name}\` - ${command.description};\n`;
    }, "**✨ Lista de Comandos ✨**\n\n");

    return message;
  }

  public static commandNotFound(commandName: string): string {
    const message = `Ops... Comando \`${commandName}\` não encontrado!\nUse \`/commands\` para ver a lista de comandos disponíveis.`;

    return message;
  }
}
