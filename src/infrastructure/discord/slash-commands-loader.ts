import { REST } from "@discordjs/rest";
import { ENVS } from "@infra/config/config";
import { Routes, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export class SlashCommandsLoader {
  private readonly commands: Array<SlashCommandBuilder> = [];

  /**
   * Carrega os comandos do diretório `commands` e os registra na API do Discord.
   */
  public async registerCommands(): Promise<void> {
    const commandsDir = path.join(__dirname, "slash-commands");

    // Carrega todos os comandos do diretório
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsDir, file);
      const commandModule = await import(filePath);

      if (commandModule.default) {
        this.commands.push(commandModule.default);
      }
    }

    // Serializa os comandos para enviar à API do Discord
    const serializedCommands = this.commands.map((command) => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(ENVS.DISCORD_BOT_TOKEN);

    try {
      if (!ENVS.SKIP_COMMAND_DELETION) {
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
      }

      if (!ENVS.SKIP_COMMAND_CREATION) {
        console.log("Registrando comandos na API do Discord...");
        const putCommandsResult = await rest.put(
          Routes.applicationCommands(ENVS.DISCORD_CLIENT_ID),
          { body: serializedCommands }
        );
        console.log("Comandos registrados com sucesso!", putCommandsResult);
      }
    } catch (error) {
      console.error("Erro ao registrar comandos:", error);
    }
  }
}
