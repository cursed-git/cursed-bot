export type TimeoutUserParams = {
  userId: string;
  guildId: string;
  duration: number;
  reason: string | undefined;
  authorId: string;
};

export type RemoveTimeoutParams = Pick<
  TimeoutUserParams,
  "userId" | "guildId" | "authorId"
>;

export interface TimeoutService {
  timeoutUser(params: TimeoutUserParams): Promise<void>;
  removeTimeout(params: RemoveTimeoutParams): Promise<void>;
}
