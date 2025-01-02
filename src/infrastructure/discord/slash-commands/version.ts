import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("version")
  .setDescription("Exibe a versão atual do Cursed Bot")
  .addBooleanOption((option) =>
    option
      .setName("changelog")
      .setDescription("Exibe o changelog da versão")
      .setRequired(false)
  );

export default command;
