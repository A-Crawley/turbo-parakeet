import {
  Button,
  ButtonGroup,
  createTheme,
  CssBaseline,
  Dialog,
  IconButton,
  Paper,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/system";
import { useEffect, useState } from "react";
import "./App.css";
import { Job } from "./classes/Job";
import { Skill } from "./classes/Skill";
import {
  familyBakery,
  purchaseableItems,
  rebirthHelper,
  selfImprovmentSkills,
} from "./Data";
import { formatDate, getCurrenyDivisions, prettyPrintCurrency } from "./Utils";
import Icon from "@mui/material/Icon";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
});

function App() {
  const birthDate = [7, 4, 1042];
  const startingAge = 16;

  const [lifeExpectency, setLifeExpectancy] = useState(20);
  const [health, setHealth] = useState(100);

  const normalTime = 150;
  const fastTime = 50;
  const faster = 10;

  const [loopTime, setLoopTime] = useState(normalTime);

  const [date, setDate] = useState(birthDate[0]);
  const [month, setMonth] = useState(birthDate[1]);
  const [year, setYear] = useState(birthDate[2] + startingAge);

  const [age, setAge] = useState(startingAge);

  const [activeJob, setActiveJob] = useState<Job | null>();
  const [activeSkill, setActiveSkill] = useState<Skill | null>();
  const [cash, setCash] = useState(0);
  const [outgoings, setOutgoings] = useState(0);

  const [paused, setPaused] = useState(true);
  const [isDead, setIsDead] = useState(false);

  const withdrawCash = (amount: number): boolean => {
    if (amount > cash) return false;
    setCash((c) => c - amount);
    return true;
  };

  const depositCash = (amount: number) => {
    setCash((c) => c + amount);
  };

  const die = () => {
    setIsDead(true);
    setPaused(true);
    setActiveJob(null);
    setActiveSkill(null);
  };

  const rebirth = () => {
    setIsDead(false);

    setDate(birthDate[0]);
    setMonth(birthDate[1]);
    setYear(birthDate[2] + startingAge);

    setCash(0);
    setHealth(100);

    setAge(startingAge);

    rebirthHelper();
  };

  const iterate = () => {
    if (paused) return;
    const tempDate = new Date(year, month, date + 1);
    setDate(tempDate.getDate());
    setMonth(tempDate.getMonth());
    setYear(tempDate.getFullYear());
    if (
      date === birthDate[0] &&
      month === birthDate[1] &&
      year > birthDate[2]
    ) {
      setAge(year - birthDate[2]);
    }

    if (age >= lifeExpectency - 2) {
      if (Math.random() > health / 50) die();
      else if (Math.random() > 0.9) setHealth(health - 1);
    }

    // DO THINGS
    if (activeJob !== null && activeJob !== undefined) {
      activeJob.increaseProgress();
      depositCash(activeJob.getIncome() - outgoings);
      setActiveJob(activeJob);
    }
    if (activeSkill !== null && activeSkill !== undefined) {
      activeSkill.increaseProgress();
      setActiveSkill(activeSkill);
    }
  };

  const pause = () => {
    setPaused(true);
  };

  const play = () => {
    setLoopTime(normalTime);
    setPaused(false);
  };

  const fastForward = () => {
    setLoopTime(fastTime);
    setPaused(false);
  };

  const fasterForwarder = () => {
    setLoopTime(faster);
    setPaused(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      iterate();
    }, loopTime);

    return () => clearInterval(interval);
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog open={isDead}>
          <div
            style={{ padding: "8px", display: "flex", flexDirection: "column" }}
          >
            <Typography>Oops, looks like you died...</Typography>
            <Typography>That's what happenes when you're mortal.</Typography>
            <Button
              sx={{ mx: "auto", mt: 2, mb: 1 }}
              variant={"contained"}
              size={"small"}
              onClick={rebirth}
            >
              Continue
            </Button>
          </div>
        </Dialog>
        <div style={{ display: "flex" }}>
          <div style={{ width: "300px" }}>
            <Paper
              sx={{
                margin: "16px",
                p: 2,
                height: "calc(100vh - calc(16px * 2))",
                minHeight: "400px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Date:</Typography>
                <Typography>
                  {formatDate(new Date(year, month, date))}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Age:</Typography>
                <Typography>{age}</Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Money:</Typography>
                <Typography>
                  {prettyPrintCurrency(getCurrenyDivisions(cash))}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Health:</Typography>
                <Typography>{health}</Typography>
              </div>
              <div style={{ display: "flex", marginTop: "8px" }}>
                <ButtonGroup sx={{ ml: "auto" }}>
                  <Button
                    size={"small"}
                    variant={"contained"}
                    disabled={paused}
                    onClick={() => pause()}
                  >
                    <Icon>pause</Icon>
                  </Button>
                  <Button
                    size={"small"}
                    variant={"contained"}
                    disabled={!paused && loopTime === normalTime}
                    onClick={() => play()}
                  >
                    <Icon>play_arrow</Icon>
                  </Button>
                  <Button
                    size={"small"}
                    variant={"contained"}
                    disabled={!paused && loopTime === fastTime}
                    onClick={() => fastForward()}
                  >
                    <Icon>fast_forward</Icon>
                  </Button>
                  <Button
                    size={"small"}
                    variant={"contained"}
                    disabled={!paused && loopTime === faster}
                    onClick={() => fasterForwarder()}
                  >
                    <Icon>fast_forward</Icon>
                  </Button>
                </ButtonGroup>
              </div>
            </Paper>
          </div>

          <div>
            <div
              style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
              }}
            ></div>
            <div style={{ marginTop: "16px" }}>Skills</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {selfImprovmentSkills.map((skill) => (
                <skill.component
                  key={skill.id}
                  setAsActive={(skill: Skill) => setActiveSkill(skill)}
                />
              ))}
            </div>
            <div>Bakery</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {familyBakery
                .filter((j) => j.unlocked())
                .map((job) => (
                  <job.component
                    key={job.id}
                    setAsActive={(job: Job) => setActiveJob(job)}
                  />
                ))}
            </div>
            <div>Items</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {purchaseableItems
                .filter((j) => true)
                .map((purchasable) => (
                  <purchasable.component
                    key={purchasable.id}
                    withdraw={withdrawCash}
                  />
                ))}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
