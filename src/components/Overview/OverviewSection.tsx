import {
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import InfoRow from "./InfoRow";
import { useDeviceData } from "../../context/DeviceDataContext";

const OverviewSection = () => {
    
    const { devices, selectedDeviceId, commandsByDevice, lastUpdated } = useDeviceData();

    const commands = selectedDeviceId ? commandsByDevice[selectedDeviceId] ?? [] : [];

    return (
        <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="h6">Overview</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Live view of device command activity.
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={1}>
                        <InfoRow label="Devices" value={devices.length.toString()} />
                        <InfoRow label="Commands" value={commands.length.toString()} />
                        <InfoRow label="Last refresh" value={lastUpdated ? new Date(lastUpdated[selectedDeviceId]).toLocaleTimeString() : "-"} />
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default OverviewSection;