import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Silencia um usuário por um tempo determinado")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Usuário a ser silenciado")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("duration")
      .setDescription("Duração em minutos")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Motivo do silenciamento")
      .setRequired(false)
  );

export default command;
