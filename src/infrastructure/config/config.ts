import dotenv from "dotenv";

dotenv.config();

/**
 * Variáveis de ambiente do projeto.
 */
export const ENVS = {
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN ?? "",
  BOT_PREFIX: process.env.BOT_PREFIX ?? "!",
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ?? "",
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID ?? "",
};

if (!ENVS.DISCORD_BOT_TOKEN) {
  console.error("Erro: DISCORD_BOT_TOKEN não encontrado no arquivo .env");
  process.exit(1);
}
