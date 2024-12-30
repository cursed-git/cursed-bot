import {
  Client,
  Interaction,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { ENVS } from "@infra/config/config";
import { CommandController } from "src/presentation/controllers/command.controller";
import { CommandExecutionContext } from "@domain/entities/command";

export class DiscordEventAdapter {
  constructor(
    private client: Client,
    private commandController: CommandController
  ) {}

  private async registerSlashCommands(): Promise<void> {
    const commands = [
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde Pong!"),
      new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Silencia um usuário por um tempo determinado.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Usuário a ser silenciado")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("Duração em minutos")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Motivo do silenciamento")
            .setRequired(false)
        ),
      new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Remove o silenciamento de um usuário.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Usuário alvo")
            .setRequired(true)
        ),
    ].map((command) => command.toJSON());

    const rest = new REST({ version: "9" }).setToken(ENVS.DISCORD_BOT_TOKEN);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(
          ENVS.DISCORD_CLIENT_ID,
          ENVS.DISCORD_GUILD_ID
        ),
        { body: commands }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Failed to reload application (/) commands:", error);
    }
  }

  public async listen(): Promise<void> {
    this.client.on("interactionCreate", async (interaction: Interaction) => {
      console.debug(interaction);

      if (!interaction.isCommand()) return;

      console.debug(interaction.options.data);

      const context: CommandExecutionContext = {
        authorId: interaction.user.id,
        channelId: interaction.channelId,
        messageContent: interaction.commandName,
        guildId: interaction.guildId ?? "",
        command: interaction.commandName,
      };

      const response = await this.commandController.handle(context);

      await interaction.reply(response);
    });

    this.client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(ENVS.BOT_PREFIX) || message.author.bot) {
        return;
      }

      console.debug(message);

      const response = await this.commandController.handle({
        authorId: message.author.id,
        channelId: message.channel.id,
        messageContent: message.content,
        guildId: message.guildId ?? "",
      });

      await message.reply(response);
    });

    this.client.once("ready", () => {
      console.log(`Bot is ready! Logged in as ${this.client.user?.tag}`);
    });

    await this.registerSlashCommands();
  }
}
