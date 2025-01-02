import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("commands")
  .setDescription("Lista todos os comandos do Cursed Bot");

export default command;
