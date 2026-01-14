import {
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { useDeviceData } from "../context/DeviceDataContext";
import { useEffect, useState } from "react";
import { getDevices } from "../api/deviceApi";


const DevicesSelector = () => {

    const {
        devices,
        setDevices,
        selectedDeviceId,
        setSelectedDeviceId,
    } = useDeviceData();

    const [devicesLoading, setDevicesLoading] = useState(true);
    const [devicesError, setDevicesError] = useState<string | null>(null);

    //Get devices
    useEffect(() => {
        let active = true;
        setDevicesLoading(true);
        setDevicesError(null);

        getDevices()
            .then((data) => {
                setDevices(data);
                setSelectedDeviceId(data[0]?.deviceId ?? "");
            })
            .catch((error) => {
                setDevicesError(error.message ?? "Unable to load devices.");
            })
            .finally(() => {
                if (!active) return;
                setDevicesLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6">Device Selection</Typography>
                {devicesLoading && (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <Typography variant="body2">
                            Loading devices
                        </Typography>
                    </Stack>
                )}
                {devicesError && <Alert severity="error">{devicesError}</Alert>}
                {!devicesLoading && !devicesError && (
                    <FormControl fullWidth>
                        <InputLabel id="select-label">Device</InputLabel>
                        <Select
                            labelId="select-label"
                            value={selectedDeviceId}
                            label="Device"
                            onChange={(event) => setSelectedDeviceId(event.target.value)}
                        >
                            {devices.map((device) => (
                                <MenuItem key={device.deviceId} value={device.deviceId}>
                                    {device.deviceId}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Stack>
        </Paper>
    );
};

export default DevicesSelector;