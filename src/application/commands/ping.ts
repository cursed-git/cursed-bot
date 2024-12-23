import { Command } from "@domain/entities/command";

export class PingCommand implements Command {
  async execute(): Promise<string> {
    return "Pong! 🏓";
  }
}
