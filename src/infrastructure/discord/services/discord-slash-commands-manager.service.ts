import { SlashCommandManagerService } from "@application/services/slash-command-manager.service";
import { ENVS } from "@infra/config/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import fs from "node:fs";
import path from "node:path";

export class DiscordSlashCommandsManagerService
  implements SlashCommandManagerService
{
  private readonly _commands: Array<SlashCommandBuilder> = [];

  public async loadCommands(): Promise<void> {
    const commandsDir = path.join(__dirname, "../slash-commands");

    // Carrega todos os comandos do diretório
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsDir, file);
      const commandModule = await import(filePath);

      if (commandModule.default) {
        this._commands.push(commandModule.default);
      }
    }

    const serializedCommands = this._commands.map((command) =>
      command.toJSON()
    );

    const rest = new REST({ version: "10" }).setToken(ENVS.DISCORD_BOT_TOKEN);

    try {
      console.log("Registrando comandos na API do Discord...");

      const putCommandsResult = await rest.put(
        Routes.applicationCommands(ENVS.DISCORD_CLIENT_ID),
        { body: serializedCommands }
      );

      console.log("Comandos registrados com sucesso!", putCommandsResult);
    } catch (error: any) {
      console.error(error);
      throw new Error("Erro ao registrar comandos na API do Discord.");
    }
  }

  public async deleteAllCommands(): Promise<void> {
    const rest = new REST({ version: "10" }).setToken(ENVS.DISCORD_BOT_TOKEN);

    try {
      console.log("Limpando comandos existentes...");

      await Promise.all([
        rest.put(Routes.applicationCommands(ENVS.DISCORD_CLIENT_ID), {
          body: [],
        }),
        rest.put(
          Routes.applicationGuildCommands(
            ENVS.DISCORD_CLIENT_ID,
            ENVS.DISCORD_GUILD_ID
          ),
          { body: [] }
        ),
      ]);

      console.log("Comandos deletados com sucesso!");
    } catch (error: any) {
      console.error(error);
      throw new Error("Erro ao deletar comandos na API do Discord.");
    }
  }
}
