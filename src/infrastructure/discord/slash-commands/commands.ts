import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("commands")
  .setDescription("Lista todos os slash commands do Cursed Bot");

export default command;
