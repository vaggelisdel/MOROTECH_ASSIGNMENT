import {
    Alert,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { CommandType } from "../configs/types";
import { COMMAND_TYPES } from "../configs/contants";
import { useDeviceData } from "../context/DeviceDataContext";
import { useState } from "react";
import { createCommand } from "../api/deviceApi";

const ScheduleCommandForm = () => {

    const {
        selectedDeviceId,
        triggerCommandsRefresh,
    } = useDeviceData();


    const [commandType, setCommandType] = useState<CommandType | "">("");
    const [paramsText, setParamsText] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const handleSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setSubmitSuccess(null);

        if (!selectedDeviceId) {
            setFormError("Select a device to schedule a command");
            return;
        }

        if (!commandType) {
            setFormError("Command type is required");
            return;
        }

        let params: unknown | undefined;

        if (paramsText.trim()) {
            try {
                params = JSON.parse(paramsText)!;
            } catch (error) {
                setFormError("Params must be valid JSON");
                return;
            }
        }

        setSubmitLoading(true);

        try {
            await createCommand(selectedDeviceId, { type: commandType, params });
            setSubmitSuccess("Command scheduled");
            setParamsText("");
            triggerCommandsRefresh();
        } catch (error) {
            setFormError(
                error instanceof Error ? error.message : "Unable to schedule command"
            );
        } finally {
            setSubmitLoading(false);
        }
    };


    return (
        <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={2} component="form" onSubmit={handleSchedule}>
                    <Typography variant="h6">Schedule Command</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="commandlabel">Command type</InputLabel>
                        <Select
                            labelId="commandlabel"
                            value={commandType}
                            label="Command type"
                            onChange={(event) =>
                                setCommandType(event.target.value)
                            }
                        >
                            <MenuItem value="">Select command</MenuItem>
                            {COMMAND_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Params (JSON)"
                        placeholder='{"reason": "manual_recovery"}'
                        multiline
                        minRows={5}
                        value={paramsText}
                        onChange={(event) => setParamsText(event.target.value)}
                    />
                    <Typography>Leave empty for no params.</Typography>

                    {formError && <Alert severity="error">{formError}</Alert>}
                    {submitSuccess && (
                        <Alert severity="success">{submitSuccess}</Alert>
                    )}

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={submitLoading || !selectedDeviceId}
                    >
                        {submitLoading ? "Scheduling..." : "Schedule command"}
                    </Button>
                </Stack>
            </Paper>
        </Grid>
    );
};

export default ScheduleCommandForm;