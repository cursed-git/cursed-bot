import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import { CommandExecutionService } from "@application/services/command-execution.service";
import { PingCommand } from "@application/commands/ping";
import { CommandController } from "./presentation/controllers/command.controller";
import { DiscordEventAdapter } from "@infra/discord/discord-event.adapter";
import { ENVS } from "@infra/config/config";

// Inicializa o cliente do Discord
const discordBotClient = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Permite interagir com servidores
    GatewayIntentBits.GuildMessages, // Permite acessar mensagens em servidores
    GatewayIntentBits.MessageContent, // Permite ler o conteúdo das mensagens
  ],
});

// Registra comandos
const commandExecutionService = new CommandExecutionService();
commandExecutionService.registerCommand("ping", new PingCommand());

const commandsController = new CommandController(commandExecutionService);

const discordEventAdapter = new DiscordEventAdapter(
  discordBotClient,
  commandsController
);

discordBotClient.login(ENVS.DISCORD_BOT_TOKEN);
discordEventAdapter.listen();
