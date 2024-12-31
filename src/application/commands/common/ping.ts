import { PingService } from "@application/services/ping.service";
import { Command } from "@domain/entities/command";

export class PingCommand implements Command<string> {
  constructor(private readonly _pingService: PingService) {}

  public async execute(): Promise<string> {
    return await this._pingService.getPing();
  }
}
