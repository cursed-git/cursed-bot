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
}
