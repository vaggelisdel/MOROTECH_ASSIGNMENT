import {
  Box,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import HeaderBar from "./components/HeaderBar";
import DevicesSelector from "./components/DevicesSelector";
import ScheduleCommandForm from "./components/ScheduleCommandForm";
import OverviewSection from "./components/Overview/OverviewSection";
import CommandsSection from "./components/Commands/CommandsSection";

export default function App() {
  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <HeaderBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <OverviewSection />
            <DevicesSelector />
            <Grid container spacing={3}>
              <CommandsSection />
              <ScheduleCommandForm />
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  )
}