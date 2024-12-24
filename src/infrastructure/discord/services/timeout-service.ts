import {
  RemoveTimeoutParams,
  TimeoutService,
  TimeoutUserParams,
} from "@application/services/timeout-service";
import { Client, GuildMember } from "discord.js";

export class DiscordTimeoutService implements TimeoutService {
  constructor(private readonly _client: Client) {}

  /** Retorna uma mensagem de erro caso a validação falhe. */
  private validateMembers(
    author: GuildMember,
    target: GuildMember
  ): string | null {
    if (!author.permissions.has("Administrator")) {
      return "Você não tem permissão para executar este comando.";
    }

    if (!target) {
      throw new Error("Membro não encontrado no servidor.");
    }

    if (!target.moderatable) {
      return "O bot não tem permissões para moderar este usuário.";
    }

    return null;
  }

  public async timeoutUser(params: TimeoutUserParams): Promise<void> {
    const { duration, userId, guildId, reason = "", authorId } = params;

    const guild = await this._client.guilds.fetch(guildId); // Buscar a guilda
    const guildMemberToBeMuted = await guild.members.fetch(userId); // Buscar o membro na guilda
    const guildMemberAuthor = await guild.members.fetch(authorId); // Buscar o autor na guilda

    const membersValidationResult = this.validateMembers(
      guildMemberAuthor,
      guildMemberToBeMuted
    );
    if (membersValidationResult) {
      throw new Error(membersValidationResult);
    }

    await guildMemberToBeMuted.timeout(duration, reason);
  }

  public async removeTimeout(params: RemoveTimeoutParams): Promise<void> {
    const { userId, guildId, authorId } = params;

    const guild = await this._client.guilds.fetch(guildId); // Buscar a guilda
    const guildMemberToBeUnmuted = await guild.members.fetch(userId); // Buscar o membro na guilda
    const guildMemberAuthor = await guild.members.fetch(authorId); // Buscar o autor na guilda

    const membersValidationResult = this.validateMembers(
      guildMemberAuthor,
      guildMemberToBeUnmuted
    );
    if (membersValidationResult) {
      throw new Error(membersValidationResult);
    }

    await guildMemberToBeUnmuted.timeout(null, "Timeout removido.");
  }
}
