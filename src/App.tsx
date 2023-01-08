import { Button, createTheme, CssBaseline, Dialog, Paper } from "@mui/material";
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
import Login from "./components/login";
import {
  daySubscription,
  getDay,
  getUserProfileAsync,
  supabase,
} from "./supabaseClient";
import { User } from "@supabase/supabase-js";
import { InfoBar } from "./components/infoBar";
import DirectionSnackbar from "./components/directrionSnackbar";
import { LoadingDialog } from "./components/loadingDialog";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#415a77",
    },
    secondary: {
      main: "#778da9",
    },
    background: {
      default: "#e0e1dd",
    },
    text: {
      primary: "#0d1b2a",
      secondary: "#0d1b2a",
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
});

function App() {
  const saveDataKey = "_7fZ";
  const birthDate = { day: 24, month: 10, year: 1024 };
  const startingAge = 16;

  const [saveSnackOpen, setSaveSnackOpen] = useState<boolean>(false);

  const [lifeExpectency, setLifeExpectancy] = useState(20);
  const [health, setHealth] = useState(100);

  const normalTime = 150;
  const fastTime = 50;
  const faster = 10;

  const [loopTime, setLoopTime] = useState(normalTime);

  const [date, setDate] = useState(birthDate.day);
  const [month, setMonth] = useState(birthDate.month);
  const [year, setYear] = useState(birthDate.year + startingAge);

  const [age, setAge] = useState(startingAge);

  const [activeJob, setActiveJob] = useState<Job | null>();
  const [activeSkill, setActiveSkill] = useState<Skill | null>();
  const [cash, setCash] = useState(0);
  const [outgoings, setOutgoings] = useState(0);

  const [paused, setPaused] = useState(true);
  const [isDead, setIsDead] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [userProfile, setUserProfile] = useState<any>();

  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [displayMain, setDisplayMain] = useState<boolean>(false);

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

    setDate(birthDate.day);
    setMonth(birthDate.month);
    setYear(birthDate.year + startingAge);

    setCash(0);
    setHealth(100);

    setAge(startingAge);

    rebirthHelper();
  };

  const iterate = () => {
    if (paused) return;

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

  const userLoggedIn = () => {
    supabase.auth.getUser().then((userResponse) => {
      if (userResponse.data.user !== null) {
        setLoggedIn(true);
        setUser(userResponse.data.user);
        getUserProfileAsync().then((data) => setUserProfile(data));
      }
    });
  };

  useEffect(() => {
    supabase.auth.getUser().then((userResponse) => {
      if (userResponse.data.user !== null) {
        setLoggedIn(true);
        setUser(userResponse.data.user);
        getUserProfileAsync().then((data) => setUserProfile(data));
      }
    });
  }, []);

  const username = () =>
    userProfile === null || userProfile === undefined
      ? ""
      : userProfile.is_guest
      ? user?.email?.replace("@looplife", "")
      : `${userProfile.user_name} (${userProfile.id})`;

  const save = () => {
    setSaveSnackOpen(true);
    const data = {
      age,
      activeJob,
      activeSkill,
      cash,
      outgoings,
      lifeExpectency,
      health,
    };
    localStorage.setItem(saveDataKey, window.btoa(JSON.stringify(data)));
  };

  useEffect(() => {}, [loggedIn, userProfile, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      iterate();
    }, loopTime);

    const saveInterval = setInterval(() => {
      save();
    }, 30 * 1000);

    getDay().then((obj) => {
      if (obj === null) {
        console.error("Cound not get current day");
        return;
      }

      const tempDate = new Date(year, month, date + obj.day);
      setDate(tempDate.getDate());
      setMonth(tempDate.getMonth());
      setYear(tempDate.getFullYear());
      if (
        date === birthDate.day &&
        month === birthDate.month &&
        year > birthDate.year
      ) {
        setAge(year - birthDate.year);
      }

      if (age >= lifeExpectency - 2) {
        if (Math.random() > health / 50) die();
        else if (Math.random() > 0.9) setHealth(health - 1);
      }
    });

    daySubscription((x) => {
      if (x.new === null) return;
      const daysToAdd = x.new as { day: number; id: number };

      const tempDate = new Date(year, month, date + daysToAdd.day);
      setDate(tempDate.getDate());
      setMonth(tempDate.getMonth());
      setYear(tempDate.getFullYear());
      if (
        date === birthDate.day &&
        month === birthDate.month &&
        year > birthDate.year
      ) {
        setAge(year - birthDate.year);
      }

      if (age >= lifeExpectency - 2) {
        if (Math.random() > health / 50) die();
        else if (Math.random() > 0.9) setHealth(health - 1);
      }
    });

    setTimeout(() => {
      setLoadingPage(false);
      setTimeout(() => {
        setDisplayMain(true);
      }, 500);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(saveInterval);
      console.log("Cleanup");
    };
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingDialog hidden={!loadingPage} />

        <div
          style={{
            display: displayMain ? "block" : "hidden",
            opacity: displayMain ? "100%" : "0%",
            transition: "opacity 2s linear",
          }}
        >
          {!loggedIn ? (
            <Login
              loggedIn={() => {
                userLoggedIn();
              }}
            />
          ) : (
            <>
              <Dialog open={isDead}>
                <div
                  style={{
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography>Oops, looks like you died...</Typography>
                  <Typography>
                    That's what happenes when you're mortal.
                  </Typography>
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
              {/*<Chat />*/}
              <InfoBar
                name={username()}
                date={formatDate(new Date(year, month, date))}
              />
              <div style={{ display: "flex" }}>
                <div style={{ width: "300px" }}>
                  <Paper
                    sx={{
                      margin: "16px",
                      p: 2,
                      height: "calc(100vh - calc(16px * 2) - 64px)",
                      minHeight: "400px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
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
            </>
          )}
        </div>

        <DirectionSnackbar
          open={saveSnackOpen}
          close={() => setSaveSnackOpen(false)}
          duration={1500}
          up={true}
          origin={{ vertical: "bottom", horizontal: "right" }}
          message={"Saved the game 😉"}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
