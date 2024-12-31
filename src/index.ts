import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import { CommandExecutionService } from "@application/services/command-execution.service";
import { DiscordEventAdapter } from "@infra/discord/discord-event.adapter";
import { ENVS } from "@infra/config/config";
import { DiscordTimeoutService } from "@infra/discord/services/discord-timeout.service";
import { TimeoutCommand } from "@application/commands/admin/timeout";
import { RemoveTimeoutCommand } from "@application/commands/admin/remove-timeout";
import { PingCommand } from "@application/commands/common/ping";
import { DiscordPingService } from "@infra/discord/services/discord-ping.service";
import { CommandController } from "@presentation/controllers/command.controller";
import { SlashCommandsLoader } from "@infra/discord/slash-commands-loader";
import { HelpCommand } from "@application/commands/common/help";

// Inicializa o cliente do Discord
const discordBotClient = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Permite interagir com servidores
    GatewayIntentBits.GuildMessages, // Permite acessar mensagens em servidores
    GatewayIntentBits.GuildModeration, // Permite dar timeout em usuários
    GatewayIntentBits.MessageContent, // Permite ler o conteúdo das mensagens
  ],
});

const timeoutService = new DiscordTimeoutService(discordBotClient);
const pingService = new DiscordPingService(discordBotClient);

const pingCommand = new PingCommand(pingService);
const timeoutCommand = new TimeoutCommand(timeoutService);
const unmuteCommand = new RemoveTimeoutCommand(timeoutService);

// Registra comandos
const commandExecutionService = new CommandExecutionService();

commandExecutionService.registerCommand("ping", pingCommand);

commandExecutionService.registerCommand("timeout", timeoutCommand);
commandExecutionService.registerCommand("mute", timeoutCommand);
commandExecutionService.registerCommand("curse", timeoutCommand);

commandExecutionService.registerCommand("untimeout", unmuteCommand);
commandExecutionService.registerCommand("unmute", unmuteCommand);
commandExecutionService.registerCommand("reverse-curse", unmuteCommand);

const helpCommand = new HelpCommand(commandExecutionService);

commandExecutionService.registerCommand("help", helpCommand);

const commandsController = new CommandController(commandExecutionService);
const slashCommandsLoader = new SlashCommandsLoader();

const discordEventAdapter = new DiscordEventAdapter(
  discordBotClient,
  slashCommandsLoader,
  commandsController
);

discordBotClient.login(ENVS.DISCORD_BOT_TOKEN);
discordEventAdapter.listen();
