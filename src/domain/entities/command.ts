/**
 * Opções disponíveis para execução do comando.
 *
 * @example
 * const muteOptions = { name: 'reason', type: 3, value: 'Motivo fútil' }
 */
export type SlashCommandOption<
  Name = string,
  Value = string | number | boolean | null
> = {
  /** Nome do comando. */
  name: Name;

  /** Tipo do comando. */
  type: number;

  /** Valor do comando. */
  value: Value;
};

export type SlashCommandExecutionContext = {
  authorId: string;
  guildId: string;
  channelId: string;
  commandName: string;
  isSlashCommand: true;
  options: SlashCommandOption[];
  interactionId: string;
};

export type PrefixedCommandExecutionContext = {
  authorId: string;
  guildId: string;
  channelId: string;
  commandName: string;
  isSlashCommand: false;
  messageContent: string;
};

export type CommandExecutionContext =
  | SlashCommandExecutionContext
  | PrefixedCommandExecutionContext;

export interface Command<Result = string> {
  /** Descrição do comando. */
  readonly description: string;

  /** Executa um comando no contexto fornecido. */
  execute(context: CommandExecutionContext): Promise<Result>;
}
