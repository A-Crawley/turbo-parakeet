import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import "./App.css";
import { Job } from "./classes/Job";
import JobCard from "./components/JobCard";

let loopTime = 150;

const formatDate = (date: Date): string => {
  return `${formatNumber(date.getDate())}/${formatNumber(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

const formatNumber = (number: Number): string => {
  let stringValue = number.toString();
  if (number < 10) stringValue = `0${number}`;
  return stringValue;
};

// CURRENCY CONVERSION
// 1000 Copper => 1 Silver
// 1000 Silver => 1 Gold

interface Currency {
  copper: number;
  silver: number;
  gold: number;
}

const getCurrenyDivisions = (copper: number): Currency => {
  const silverConversionRate = 1000;
  const goldConversionRate = silverConversionRate * 1000;

  copper = Math.round(copper);

  let currency = { copper: 0, silver: 0, gold: 0 };

  if (copper >= goldConversionRate) {
    let temp = Math.floor(copper / goldConversionRate);
    currency.gold = temp;
    copper -= temp * goldConversionRate;
  }

  if (copper >= silverConversionRate) {
    let temp = Math.floor(copper / silverConversionRate);
    currency.silver = temp;
    copper -= temp * silverConversionRate;
  }

  if (copper > 0) {
    currency.copper = copper;
  }

  return currency;
};

const prettyPrintCurrency = (currency: Currency): string => {
  return `${currency.gold > 0 ? currency.gold + "g" : ""} 
    ${currency.silver > 0 ? currency.silver + "s" : ""} 
    ${currency.copper > 0 ? currency.copper + "c" : "0c"}`;
};

// FAMILY BAKERY
const helperJob = new Job(1, "Helper", 1, 0.01, () => true, 2);
const assistantJob = new Job(
  2,
  "Assistant",
  1 / 2,
  0.05,
  () => helperJob.getLevel() >= 10,
  2
);
const apprenticeJob = new Job(
  3,
  "Apprentice Baker",
  1 / 3,
  0.1,
  () => assistantJob.getLevel() >= 10,
  2
);
const juniorJob = new Job(
  4,
  "Junior Baker",
  1 / 4,
  0.5,
  () => apprenticeJob.getLevel() >= 10,
  2
);
const breadBakerJob = new Job(
  5,
  "Bread Baker",
  1 / 5,
  1,
  () => juniorJob.getLevel() >= 10,
  2
);
const bakerJob = new Job(
  6,
  "Baker",
  1 / 6,
  2,
  () => breadBakerJob.getLevel() >= 10,
  2
);
const headBakerJob = new Job(
  7,
  "Head Baker",
  1 / 7,
  3,
  () => bakerJob.getLevel() >= 10,
  2
);
const bakeryOwnerJob = new Job(
  8,
  "Bakery Owner",
  1 / 8,
  4,
  () => headBakerJob.getLevel() >= 10,
  2
);

const familyBakery: Job[] = [
  helperJob,
  assistantJob,
  apprenticeJob,
  juniorJob,
  breadBakerJob,
  bakerJob,
  headBakerJob,
  bakeryOwnerJob,
];

function App() {
  const birthDate = [7, 4, 1042];
  const startingAge = 16;

  const [date, setDate] = useState(birthDate[0]);
  const [month, setMonth] = useState(birthDate[1]);
  const [year, setYear] = useState(birthDate[2] + startingAge);

  const [age, setAge] = useState(startingAge);

  const [activeJob, setActiveJob] = useState<Job>();
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
      <div>
        {familyBakery
          .filter((j) => j.unlocked())
          .map((job) => (
            <JobCard
              key={job.id}
              setActiveJob={() => setActiveJob(job)}
              job={job}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
