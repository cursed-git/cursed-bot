import { PingService } from "@application/services/ping.service";

export class DiscordPingService implements PingService {
  public async getPing(): Promise<string> {
    return "Pong 🏓";
  }
}
