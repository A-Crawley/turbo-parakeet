import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import "./App.css";
import { Job } from "./classes/Job";
import { Skill } from "./classes/Skill";
import { familyBakery, selfImprovmentSkills } from "./Data";
import { formatDate, getCurrenyDivisions, prettyPrintCurrency } from "./Utils";

function App() {
  const birthDate = [7, 4, 1042];
  const startingAge = 16;

  const loopTime = 150;

  const [date, setDate] = useState(birthDate[0]);
  const [month, setMonth] = useState(birthDate[1]);
  const [year, setYear] = useState(birthDate[2] + startingAge);

  const [age, setAge] = useState(startingAge);

  const [activeJob, setActiveJob] = useState<Job>();
  const [activeSkill, setActiveSkill] = useState<Skill>();
  const [cash, setCash] = useState(0);

  const [paused, setPaused] = useState(false);

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
    // DO THINGS
    if (activeJob !== null && activeJob !== undefined) {
      activeJob.increaseProgress();
      setCash((cash) => cash + activeJob.getIncome());
      setActiveJob(activeJob);
    }
    if (activeSkill !== null && activeSkill !== undefined) {
      activeSkill.increaseProgress();
      setActiveSkill(activeSkill);
    }
  };

  const togglePaused = () => {
    setPaused(!paused);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      iterate();
    }, loopTime);

    return () => clearInterval(interval);
  });

  return (
    <div>
      <div style={{ width: "200px", display: "flex", flexDirection: "column" }}>
        <Button variant={"contained"} onClick={() => togglePaused()}>
          {paused ? "Resume" : "Pause"}
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography>Date:</Typography>
          <Typography>{formatDate(new Date(year, month, date))}</Typography>
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
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {selfImprovmentSkills.map((skill) => (
          <skill.component
            key={skill.id}
            setAsActive={(skill: Skill) => setActiveSkill(skill)}
          />
        ))}
      </div>
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
    </div>
  );
}

export default App;
