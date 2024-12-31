export type TimeoutUserParams = {
  userId: string;
  guildId: string;
  /** Duração em milissegundos */
  duration: number;
  reason: string | undefined;
  authorId: string;
};

export type RemoveTimeoutParams = Pick<
  TimeoutUserParams,
  "userId" | "guildId" | "authorId"
>;

export type TimeoutOptions = {
  userId: string;
  durationInMinutes: number;
  reason?: string;
};

export type RemoveTimeoutOptions = Pick<TimeoutOptions, "userId">;

export interface TimeoutService {
  timeoutUser(params: TimeoutUserParams): Promise<void>;
  removeTimeout(params: RemoveTimeoutParams): Promise<void>;
}
