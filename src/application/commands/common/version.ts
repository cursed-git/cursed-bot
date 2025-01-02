import {
  Command,
  CommandExecutionContext,
  PrefixedCommandExecutionContext,
  SlashCommandExecutionContext,
  SlashCommandOption,
} from "@domain/entities/command";
import { ENVS } from "@infra/config/config";
import { MessageBuilder } from "@templates/message-builder";
import * as fs from "node:fs";
import * as path from "node:path";

export class VersionCommand implements Command {
  public readonly description: string;

  constructor() {
    this.description = "Exibe a versão atual do Cursed Bot";
  }

  private getChangeLog(): string | null {
    try {
      const changelogPath = path.resolve(
        __dirname,
        `../../../../docs/changelogs/${ENVS.ENV}/${ENVS.VERSION}.md`
      );
      return fs.readFileSync(changelogPath, "utf-8");
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  private extractSlashCommandOptions(options: SlashCommandOption[]): {
    showChangelog: boolean;
  } {
    const showChangelog = options.find(
      (opt) => opt.name === "changelog"
    )?.value;

    return {
      showChangelog: showChangelog as boolean,
    };
  }

  private handleSlashCommand(context: SlashCommandExecutionContext): string {
    const options = this.extractSlashCommandOptions(context.options);
    const versionMessage = MessageBuilder.version(ENVS.VERSION);

    if (options.showChangelog) {
      const changelog = this.getChangeLog();
      return `${versionMessage}\n${changelog}`;
    }
    return versionMessage;
  }

  private handlePrefixedCommand(
    context: PrefixedCommandExecutionContext
  ): string {
    const [_, showChangelog] = context.messageContent.split(" ");
    const versionMessage = MessageBuilder.version(ENVS.VERSION);

    if (!!showChangelog) {
      const changelog = this.getChangeLog();
      return `${versionMessage}\n${changelog}`;
    }
    return versionMessage;
  }

  public async execute(context: CommandExecutionContext): Promise<string> {
    try {
      if (context.isSlashCommand) {
        return this.handleSlashCommand(context);
      }
      return this.handlePrefixedCommand(context);
    } catch (error: any) {
      console.error(error);
      return `Error: ${error?.message}`;
    }
  }
}
