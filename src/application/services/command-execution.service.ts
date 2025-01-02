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

  constructor(commands?: Map<string, Command>) {
    this._commands = commands ?? new Map<string, Command>();
  }

  public registerCommand(name: string, command: Command): void {
    this._commands.set(name, command);
  }

  public getCommands(): Map<string, Command> {
    return new Map(this._commands);
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
