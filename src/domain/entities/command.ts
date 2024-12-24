/**
 * Representa um comando que pode ser executado.
 */
export interface Command<Result = unknown> {
  execute(context: CommandExecutionContext): Promise<Result>;
}

/**
 * Representa o contexto em que um comando é executado.
 * Fornece informações essenciais sobre a mensagem, o autor e o canal.
 */
export type CommandExecutionContext = {
  /** O conteúdo completo da mensagem que disparou o comando. */
  messageContent: string;

  /** O identificador único do usuário que enviou a mensagem. */
  authorId: string;

  /** O identificador único do canal onde a mensagem foi enviada. */
  channelId: string;

  /** O identificador único da guilda onde a mensagem foi enviada. */
  guildId: string;
};
