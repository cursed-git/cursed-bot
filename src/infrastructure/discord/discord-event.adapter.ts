import { Client } from "discord.js";
import { ENVS } from "@infra/config/config";
import { CommandController } from "src/presentation/controllers/command.controller";

export class DiscordEventAdapter {
  constructor(
    private client: Client,
    private commandController: CommandController
  ) {}

  public listen(): void {
    this.client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(ENVS.BOT_PREFIX) || message.author.bot) {
        return;
      }

      const response = await this.commandController.handle({
        authorId: message.author.id,
        channelId: message.channel.id,
        messageContent: message.content,
      });

      await message.reply(response);
    });

    this.client.once("ready", () => {
      console.log(`Bot is ready! Logged in as ${this.client.user?.tag}`);
    });
  }
}
