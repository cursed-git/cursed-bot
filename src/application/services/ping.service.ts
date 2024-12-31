export interface PingService {
  /** Retorna uma mensagem para o client. */
  getPing(): Promise<string>;
}
