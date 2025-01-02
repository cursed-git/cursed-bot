import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Pong! 🏓 Mede a latência do servidor");

export default command;
