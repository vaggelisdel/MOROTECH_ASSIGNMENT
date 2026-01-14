export type CommandType = "PING" | "REBOOT" | "COLLECT_LOGS";

export type CommandStatus = "PENDING" | "LEASED" | "COMPLETED" | "FAILED";

export type Device = {
  deviceId: string;
};

export type Command = {
  commandId: string;
  deviceId: string;
  type: CommandType;
  params: unknown | null;
  status: CommandStatus;
  createdAt: string;
  leaseExpiresAt: string | null;
  completedAt: string | null;
};

export type NewCommandRequest = {
  type: CommandType;
  params?: unknown;
};
