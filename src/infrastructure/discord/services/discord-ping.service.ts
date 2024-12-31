import { PingService } from "@application/services/ping.service";
import { MessageBuilder } from "@templates/message-builder";
import { Client } from "discord.js";

export class DiscordPingService implements PingService {
  constructor(private readonly _discordClient: Client) {}

  public async getPing(): Promise<string> {
    const websocketPing =
      this._discordClient.ws.ping < 0 ? 0 : this._discordClient.ws.ping;

    return MessageBuilder.ping({ websocketPing });
  }
}
