import { Command, CommandExecutionContext } from "@domain/entities/command";
import { MessageBuilder } from "@templates/message-builder";

/**
 * Caso de uso responsável pela execução de comandos.
 * A classe gerencia a lógica de negócios para encontrar e executar um comando
 * com base no nome do comando e no contexto fornecido.
 */
export class CommandExecutionService {
  /**
   * Um dicionário de comandos disponíveis, onde a chave é o nome do comando e o valor é a instância do comando.
   */
  private readonly _commands: Map<string, Command>;

  /**
   * Um dicionário de aliases de comandos, onde a chave é o nome do comando e o valor é uma lista de aliases.
   */
  private readonly _commandsAliases: Map<string, string[]>;

  constructor(commands?: Map<string, Command>) {
    this._commands = commands ?? new Map<string, Command>();
    this._commandsAliases = new Map<string, string[]>();
  }

  public registerCommand(
    name: string,
    command: Command,
    aliases?: string[]
  ): void {
    if (aliases) {
      aliases.forEach((alias) => {
        this._commands.set(alias, command);
        this._commandsAliases.set(name, aliases);
      });
    } else {
      this._commandsAliases.set(name, []);
    }
    this._commands.set(name, command);
  }

  public getCommands(): Map<string, Command> {
    return new Map(this._commands);
  }

  public getAliases(): Map<string, string[]> {
    return new Map(this._commandsAliases);
  }

  public async execute(
    commandName: string,
    context: CommandExecutionContext
  ): Promise<any> {
    const command = this._commands.get(commandName);

    if (!command) {
      throw new Error(MessageBuilder.commandNotFound(commandName));
    }

    return await command.execute(context);
  }
}
