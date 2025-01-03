import { SlashCommand } from "@domain/entities/slash-command";
import { ENVS } from "@infra/config/config";

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
      return acc + `- \`/${command.name}\` - ${command.description};\n`;
    }, "**✨ Lista de Comandos ✨**\n\n");

    return message;
  }

  public static commandNotFound(commandName: string): string {
    const message = `Ops... Comando \`${commandName}\` não encontrado!\nUse \`/commands\` para ver a lista de comandos disponíveis.`;

    return message;
  }

  public static version(version: string): string {
    return `
## ✨ Cursed Bot ✨

### 🗂️ Versão
- \`${ENVS.ENV} ${version}\`
### 🔧 Status
- Em desenvolvimento contínuo – sempre melhorando para você!
### 📌 Detalhes:
- Prefixo: \`${ENVS.BOT_PREFIX}\`
- Tipo de comandos: Prefixados e Slash Commands
- Suporte total a interações modernas do Discord 🚀

**🤍 Obrigado por usar o Cursed Bot!**`;
  }
}
