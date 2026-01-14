import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Command, CommandStatus, CommandType, Device, NewCommandRequest } from "../configs/types";

const devices: Device[] = [
  { deviceId: "d_001" },
  { deviceId: "d_002" },
  { deviceId: "d_003" },
];

let commandCounter = 200;

const commandStore: Record<string, Command[]> = {
  d_001: [
    createSeedCommand({
      deviceId: "d_001",
      type: "REBOOT",
      status: "LEASED",
      createdAt: minutesAgo(4),
    }),
    createSeedCommand({
      deviceId: "d_001",
      type: "PING",
      status: "COMPLETED",
      createdAt: minutesAgo(10),
      completedAt: minutesAgo(8),
    }),
  ],
  d_002: [
    createSeedCommand({
      deviceId: "d_002",
      type: "COLLECT_LOGS",
      status: "PENDING",
      createdAt: minutesAgo(1),
    }),
  ],
  d_003: [],
};

export async function handleRequest(
  config: AxiosRequestConfig
): Promise<AxiosResponse> {
  return withLatency(async () => {
    const method = (config.method ?? "get").toLowerCase();
    const url = new URL(config.url ?? "/", "http://localhost");
    const path = url.pathname;

    if (method === "get" && path === "/devices") {
      return buildResponse(config, 200, parse(devices));
    }

    const commandMatch = path.match(/^\/devices\/([^/]+)\/commands$/);
    if (commandMatch) {
      const deviceId = commandMatch[1];

      if (method === "get") {
        const commands = commandStore[deviceId] ?? [];
        advanceCommandStatuses(commands);
        return buildResponse(config, 200, parse(commands).sort(sortNewestFirst));
      }

      if (method === "post") {
        const payload = parseBody<NewCommandRequest>(config.data);
        if (!payload?.type) {
          return buildResponse(config, 400, { message: "type is required" });
        }

        const command: Command = {
          commandId: `c_${commandCounter++}`,
          deviceId,
          type: payload.type,
          params: payload.params ?? null,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          leaseExpiresAt: null,
          completedAt: null,
        };

        if (!commandStore[deviceId]) {
          commandStore[deviceId] = [];
        }

        commandStore[deviceId].push(command);
        return buildResponse(config, 201, parse(command));
      }
    }

    return buildResponse(config, 404, { message: "Not found" });
  });
}

function withLatency<T>(factory: () => Promise<T> | T): Promise<T> {
  return new Promise((resolve, reject) => {
    const latency = 800;
    setTimeout(() => {
      Promise.resolve(factory()).then(resolve).catch(reject);
    }, latency);
  });
}

function buildResponse(
  config: AxiosRequestConfig,
  status: number,
  data: unknown
): any {
  return {
    data,
    status,
    statusText: status >= 400 ? "Error" : "OK",
    config,
  };
}

function parseBody<T>(data: unknown): T | null {
  if (!data) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      return null;
    }
  }
  return data as T;
}

function advanceCommandStatuses(commands: Command[]): void {
  const now = Date.now();

  commands.forEach((command) => {
    const createdAt = Date.parse(command.createdAt);
    if (command.status === "PENDING" && now - createdAt > 15_000) {
      command.status = "LEASED";
      command.leaseExpiresAt = new Date(now + 30_000).toISOString();
    }
console.log(Math.random());

    if (command.status === "LEASED" && now - createdAt > 45_000) {
      command.status = Math.random() > 0.15 ? "COMPLETED" : "FAILED";
      command.completedAt = new Date(now).toISOString();
    }
  });
}

function sortNewestFirst(a: Command, b: Command): number {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

function parse<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function minutesAgo(amount: number): string {
  return new Date(Date.now() - amount * 60_000).toISOString();
}

function createSeedCommand(input: {
  deviceId: string;
  type: CommandType;
  status: CommandStatus;
  createdAt: string;
  completedAt?: string;
}): Command {
  return {
    commandId: `c_${commandCounter++}`,
    deviceId: input.deviceId,
    type: input.type,
    params: { seeded: true },
    status: input.status,
    createdAt: input.createdAt,
    leaseExpiresAt: input.status === "LEASED" ? minutesAgo(-1) : null,
    completedAt: input.completedAt ?? null,
  };
}
