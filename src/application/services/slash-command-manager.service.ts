export interface SlashCommandManagerService {
  loadCommands(): Promise<void>;
  deleteAllCommands(): Promise<void>;
}
