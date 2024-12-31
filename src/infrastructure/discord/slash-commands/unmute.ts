import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("unmute")
  .setDescription("Remove o silenciamento de um usuário")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Usuário que terá o timeout removido")
      .setRequired(true)
  );

export default command;
