import {
  Box,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import HeaderBar from "./components/HeaderBar";
import InfoBox from "./components/InfoBox";
import DevicesSelector from "./components/DevicesSelector";
import CommandsSection from "./components/CommandsSection";
import ScheduleCommandForm from "./components/ScheduleCommandForm";

export default function App() {
  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <HeaderBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <InfoBox />
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