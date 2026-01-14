import type { Command, Device, NewCommandRequest } from "../configs/types";
import httpClient from "./httpClient";

export async function getDevices(): Promise<Device[]> {
  const response = await httpClient.get<Device[]>("/devices");
  return response.data;
}

export async function getCommands(deviceId: string): Promise<Command[]> {
  const response = await httpClient.get<Command[]>(`/devices/${deviceId}/commands`);
  return response.data;
}

export async function createCommand(
  deviceId: string,
  request: NewCommandRequest
): Promise<Command> {
  const response = await httpClient.post<Command>(
    `/devices/${deviceId}/commands`,
    request
  );
  return response.data;
}
