import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("prefixedcommands")
  .setDescription("Lista todos os comandos prefixados do Cursed Bot");

export default command;
