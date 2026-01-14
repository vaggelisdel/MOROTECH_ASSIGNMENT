import { Alert, Box, CircularProgress, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import FilterButtons from './FilterButtons';
import CommandsList from './CommandsList';
import { useState } from 'react';
import type { StatusFilter } from '../../configs/contants';
import { useDeviceData } from '../../context/DeviceDataContext';

const CommandsSection = () => {

    const {
        selectedDeviceId,
        commandsByDevice,
    } = useDeviceData();

    const commands = selectedDeviceId ? commandsByDevice[selectedDeviceId] ?? [] : [];

    const [commandsLoading, setCommandsLoading] = useState(false);
    const [commandsError, setCommandsError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    return (
        <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Typography variant="h6">Commands</Typography>

                        {commandsLoading && selectedDeviceId && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={16} />
                                <Typography variant="caption">
                                    Refreshing...
                                </Typography>
                            </Stack>
                        )}

                    </Box>
                    <Typography variant="body2">
                        Filter commands by status
                    </Typography>

                    {!selectedDeviceId && (
                        <Alert severity="info">
                            Select a device to view commands
                        </Alert>
                    )}

                    {selectedDeviceId && commandsError && (
                        <Alert severity="error">{commandsError}</Alert>
                    )}

                    {selectedDeviceId && !commandsError && commands.length === 0 && (
                        <Alert severity="info">No commands for this device</Alert>
                    )}

                    <FilterButtons
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />

                    {selectedDeviceId &&
                        statusFilter && (
                            <Box>
                                <Divider sx={{ mb: 2 }} />
                                <CommandsList statusFilter={statusFilter} setCommandsLoading={setCommandsLoading} setCommandsError={setCommandsError} />
                            </Box>
                        )}
                </Stack>
            </Paper>
        </Grid>
    );
};

export default CommandsSection;