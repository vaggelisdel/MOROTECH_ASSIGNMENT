import {
  Box,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import HeaderBar from "./components/HeaderBar";
import DevicesSelector from "./components/DevicesSelector";
import ScheduleCommandForm from "./components/ScheduleCommandForm";
import InfoBox from "./components/GeneralInfo/InfoBox";
import CommandsSection from "./components/Commands/CommandsSection";

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