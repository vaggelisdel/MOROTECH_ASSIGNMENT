import { Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import formatDate from '../utils/formatDate';
import { STATUS_COLORS, TERMINAL_STATUSES } from '../configs/contants';
import type { CommandStatus } from '../configs/types';
import { useDeviceData } from '../context/DeviceDataContext';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getCommands } from '../api/deviceApi';

const CommandsList = ({
    statusFilter,
    setCommandsLoading,
    setCommandsError
}: {
    statusFilter: string,
    setCommandsLoading: (loading: boolean) => void,
    setCommandsError: (error: string | null) => void
}) => {

    const {
        selectedDeviceId,
        commandsByDevice,
        setLastUpdated,
        setCommandsForDevice,
        commandsRefreshToggle,
    } = useDeviceData();

    const commands = selectedDeviceId ? commandsByDevice[selectedDeviceId] ?? [] : [];
    const inFlightRef = useRef(false);
    const queuedRefreshRef = useRef(false);

    //Load commands on device change
    const loadCommands = useCallback(
        async (deviceId: string, { silent }: { silent?: boolean } = {}) => {
            if (!deviceId) {
                return;
            }
            if (inFlightRef.current) {
                queuedRefreshRef.current = true;
                return;
            }
            inFlightRef.current = true;
            if (!silent) {
                setCommandsLoading(true);
            }
            setCommandsError(null);

            try {
                const data = await getCommands(deviceId);
                setCommandsForDevice(deviceId, data);
                setLastUpdated(deviceId, Date.now());
            } catch (error) {
                setCommandsError("Unable to load commands. - " + (error instanceof Error ? error.message : String(error)));
            } finally {
                inFlightRef.current = false;
                setCommandsLoading(false);
                if (queuedRefreshRef.current) {
                    queuedRefreshRef.current = false;
                    if (selectedDeviceId) {
                        loadCommands(selectedDeviceId, { silent: true });
                    }
                }
            }
        }, [selectedDeviceId, setCommandsError, setCommandsForDevice, setCommandsLoading, setLastUpdated]);


    //Load commands when select a device or adding a new command
    useEffect(() => {
        setCommandsError(null);
        if (selectedDeviceId) {
            loadCommands(selectedDeviceId);
        }
    }, [commandsRefreshToggle, loadCommands, selectedDeviceId]);


    //Refresh commands every 5 seconds
    useEffect(() => {
        if (!selectedDeviceId) return;

        const intervalId = window.setInterval(() => {
            loadCommands(selectedDeviceId, { silent: true });
            setLastUpdated(selectedDeviceId, Date.now());
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [loadCommands, selectedDeviceId, setLastUpdated]);


    //Filter commands
    const filteredCommands = useMemo(() => {
        if (statusFilter === "all") return commands;
        if (statusFilter === "pending") {
            return commands.filter((command) => command.status === "PENDING");
        }
        if (statusFilter === "leased") {
            return commands.filter((command) => command.status === "LEASED");
        }
        return commands.filter((command) => TERMINAL_STATUSES.includes(command.status));
    }, [commands, statusFilter]);


    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Created</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Lease expires</TableCell>
                    <TableCell>Completed</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredCommands.map((command) => (
                    <TableRow key={command.commandId}>
                        <TableCell>{formatDate(command.createdAt)}</TableCell>
                        <TableCell>{command.type}</TableCell>
                        <TableCell>
                            <Chip
                                label={command.status}
                                size="small"
                                color={STATUS_COLORS[command.status]}
                            />
                        </TableCell>
                        <TableCell>
                            {formatDate(command.leaseExpiresAt)}
                        </TableCell>
                        <TableCell>
                            {formatDate(command.completedAt)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default CommandsList;
