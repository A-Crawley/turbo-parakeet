import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import "./App.css";
import { Job } from "./classes/Job";
import JobCard from './components/JobCard'

let loopTime = 250;

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

function App() {
  const [date, setDate] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(1942);



  const [jobA, setJobA] = useState<Job>(new Job('Job A'));
  const [jobB, setJobB] = useState<Job>(new Job('Job B'));
  const [activeJob, setActiveJob] = useState<Job>();

  const itterate = () => {
    const tempDate = new Date(year, month, date + 1);
    setDate(tempDate.getDate());
    setMonth(tempDate.getMonth());
    setYear(tempDate.getFullYear());
    // DO THINGS
    if (activeJob !== null && activeJob !== undefined)
    {
      activeJob.increaseProgress();
      setActiveJob(activeJob);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      itterate();
    }, loopTime);

    return () => clearInterval(interval);
  });

  return (
    <div>
      <div style={{ width: "100px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Typography>{formatDate(new Date(year, month, date))}</Typography>
        </div>
      </div>
      <div>
        <JobCard 
          level={jobA.getLevel()} 
          name={jobA.getName()} 
          setActiveJob={() => setActiveJob(jobA)}  
          progressPercentage={jobA.getProgressPercentage()}
          progress={jobA.getProgress()}
          progressNeededToNextLevel={jobA.getProgressNeededToLevel()}
        />
        <JobCard 
          level={jobB.getLevel()} 
          name={jobB.getName()} 
          setActiveJob={() => setActiveJob(jobB)} 
          progressPercentage={jobB.getProgressPercentage()}
          progress={jobB.getProgress()}
          progressNeededToNextLevel={jobB.getProgressNeededToLevel()}
        />
      </div>
    </div>
  );
}

export default App;
