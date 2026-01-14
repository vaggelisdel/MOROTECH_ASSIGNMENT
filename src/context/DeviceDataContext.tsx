import { createContext, useContext, useMemo, useState } from "react";
import type { Command, Device } from "../configs/types";

type DeviceDataState = {
  devices: Device[];
  selectedDeviceId: string;
  commandsByDevice: Record<string, Command[]>;
  lastUpdated: Record<string, number>;
  commandsRefreshToggle: boolean;
};

type DeviceDataContextValue = DeviceDataState & {
  setDevices: (devices: Device[]) => void;
  setSelectedDeviceId: (deviceId: string) => void;
  setCommandsForDevice: (deviceId: string, commands: Command[]) => void;
  setLastUpdated: (deviceId: string, timestamp: number) => void;
  triggerCommandsRefresh: () => void;
};

const DeviceDataContext = createContext<DeviceDataContextValue | null>(null);

export function DeviceDataProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [commandsByDevice, setCommandsByDevice] = useState<
    Record<string, Command[]>
  >({});
  const [lastUpdated, setLastUpdated] = useState<Record<string, number>>({});
  const [commandsRefreshToggle, setCommandsRefreshToggle] = useState(false);

  const value = useMemo<DeviceDataContextValue>(
    () => ({
      devices,
      selectedDeviceId,
      setDevices,
      setSelectedDeviceId,
      lastUpdated,
      commandsRefreshToggle,
      setLastUpdated: (deviceId, timestamp: number) => {
        setLastUpdated((current) => ({
          ...current,
          [deviceId]: timestamp,
        }));
      },
      triggerCommandsRefresh: () => {
        setCommandsRefreshToggle((current) => !current);
      },
      commandsByDevice,
      setCommandsForDevice: (deviceId, commands) => {
        setCommandsByDevice((current) => ({
          ...current,
          [deviceId]: commands,
        }));
      },
    }),
    [commandsByDevice, commandsRefreshToggle, devices, lastUpdated, selectedDeviceId]
  );

  return (
    <DeviceDataContext.Provider value={value}>
      {children}
    </DeviceDataContext.Provider>
  );
}

export function useDeviceData(): DeviceDataContextValue {
  const context = useContext(DeviceDataContext);
  if (!context) {
    throw new Error("No context available for DeviceDataContext");
  }
  return context;
}
