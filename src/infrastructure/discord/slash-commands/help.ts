import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Lista todos os comandos do Cursed Bot");

export default command;
