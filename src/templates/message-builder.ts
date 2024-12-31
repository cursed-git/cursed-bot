type TimeoutMessageParams = {
  userId: string;
  durationInMinutes: number;
  reason?: string;
};

export class MessageBuilder {
  public static timeout(params: TimeoutMessageParams): string {
    const baseMessage = `Usuário <@${params.userId}> foi silenciado por ${params.durationInMinutes} minutos.`;

    if (params.reason) {
      return `${baseMessage}\n**Motivo:** _${params.reason}_`;
    }

    return baseMessage;
  }
}
