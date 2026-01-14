import type { CommandStatus, CommandType } from "./types";

const STATUS_FILTERS = ["all", "pending", "leased", "terminal"] as const;

const COMMAND_TYPES: CommandType[] = ["PING", "REBOOT", "COLLECT_LOGS"];

const TERMINAL_STATUSES: CommandStatus[] = ["COMPLETED", "FAILED"];

const STATUS_COLORS: Record<
  CommandStatus,
  "warning" | "info" | "success" | "error"
> = {
  PENDING: "warning",
  LEASED: "info",
  COMPLETED: "success",
  FAILED: "error",
};

export {
  STATUS_FILTERS,
  COMMAND_TYPES,
  TERMINAL_STATUSES,
  STATUS_COLORS,
};

export type StatusFilter = (typeof STATUS_FILTERS)[number];
