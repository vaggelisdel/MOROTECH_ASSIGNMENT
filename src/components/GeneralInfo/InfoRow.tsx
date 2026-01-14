import { Box, Typography } from "@mui/material";

const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography variant="body2">
                {label}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
                {value}
            </Typography>
        </Box>
    );
};

export default InfoRow;