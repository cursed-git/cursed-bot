import { SlashCommand } from "@domain/entities/slash-command";

export interface ListCommandsService {
  listCommands(): Promise<SlashCommand[]>;
}
