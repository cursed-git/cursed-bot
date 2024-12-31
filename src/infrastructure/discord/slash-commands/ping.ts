import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Pong!");

export default command;
