import { PingService } from "@application/services/ping.service";
import { Command } from "@domain/entities/command";

export class PingCommand implements Command<string> {
  public readonly description: string;

  constructor(private readonly _pingService: PingService) {
    this.description = "Responde com Pong!";
  }

  public async execute(): Promise<string> {
    return await this._pingService.getPing();
  }
}
