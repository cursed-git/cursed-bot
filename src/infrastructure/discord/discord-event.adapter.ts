import { Client, Interaction } from "discord.js";
import {
  CommandExecutionContext,
  SlashCommandOption,
} from "@domain/entities/command";
import { CommandController } from "@presentation/controllers/command.controller";
import { ENVS } from "@infra/config/config";

export class DiscordEventAdapter {
  constructor(
    private readonly _client: Client,
    private readonly _commandController: CommandController
  ) {}

  public async listen(): Promise<void> {
    this._client.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;

      const extractedOptions: SlashCommandOption[] =
        interaction.options.data.map((opt) => ({
          name: opt.name,
          type: opt.type,
          value: opt?.value ?? null,
        }));

      const context: CommandExecutionContext = {
        authorId: interaction.user.id,
        channelId: interaction.channelId,
        guildId: interaction.guildId ?? "",
        commandName: interaction.commandName,
        isSlashCommand: true,
        options: extractedOptions,
        interactionId: interaction.id,
      };

      const response = await this._commandController.handle(context);

      await interaction.reply({
        content: response,
        options: { ephemeral: true },
      });
    });

    this._client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(ENVS.BOT_PREFIX) || message.author.bot) {
        return;
      }

      const commandName = message.content.slice(1).split(" ")[0];

      const response = await this._commandController.handle({
        authorId: message.author.id,
        channelId: message.channel.id,
        messageContent: message.content,
        guildId: message.guildId ?? "",
        isSlashCommand: false,
        commandName: commandName,
      });

      await message.reply(response);
    });

    this._client.once("ready", () => {
      console.log(`Bot is ready! Logged in as ${this._client.user?.tag}`);
    });
  }
}
