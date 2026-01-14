import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

const HeaderBar = () => {
    return (
        <AppBar position="static" color="inherit" elevation={0}>
            <Toolbar>
                <Stack spacing={0.5}>
                    <Typography variant="overline">
                        Control Panel
                    </Typography>
                    <Typography variant="h6">Device Control Panel</Typography>
                    <Typography variant="body2">
                        Select a device, schedule commands, and monitor live execution in one
                        place.
                    </Typography>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderBar;