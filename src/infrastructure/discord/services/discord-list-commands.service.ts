import { ListCommandsService } from "@application/services/list-commands.service";
import { SlashCommand } from "@domain/entities/slash-command";
import { ENVS } from "@infra/config/config";
import { APIApplicationCommand, REST, Routes } from "discord.js";

export class DiscordListCommandsService implements ListCommandsService {
  public async listCommands(): Promise<SlashCommand[]> {
    try {
      const rest = new REST({ version: "10" }).setToken(ENVS.DISCORD_BOT_TOKEN);

      const globalCommands = (await rest.get(
        Routes.applicationCommands(ENVS.DISCORD_CLIENT_ID)
      )) as APIApplicationCommand[];

      console.debug("globalCommands", globalCommands);

      return globalCommands.map((command) => {
        return SlashCommand.build({
          name: command.name,
          description: command.description,
        });
      });
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
