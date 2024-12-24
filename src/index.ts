import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import { CommandExecutionService } from "@application/services/command-execution.service";
import { PingCommand } from "@application/commands/ping";
import { CommandController } from "./presentation/controllers/command.controller";
import { DiscordEventAdapter } from "@infra/discord/discord-event.adapter";
import { ENVS } from "@infra/config/config";
import { DiscordTimeoutService } from "@infra/discord/services/timeout-service";
import { TimeoutCommand } from "@application/commands/timeout";
import { RemoveTimeoutCommand } from "@application/commands/remove-timeout";

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

const pingCommand = new PingCommand();
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
commandExecutionService.registerCommand("uncurse", unmuteCommand);

const commandsController = new CommandController(commandExecutionService);

const discordEventAdapter = new DiscordEventAdapter(
  discordBotClient,
  commandsController
);

discordBotClient.login(ENVS.DISCORD_BOT_TOKEN);
discordEventAdapter.listen();
