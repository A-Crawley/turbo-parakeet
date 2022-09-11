import { LinearProgress, Paper, Typography } from "@mui/material";
import { Job } from "../classes/Job";

interface Props {
  job: Job;
  setActiveJob: Function;
}

export default function JobCard({ job, setActiveJob }: Props) {
  return (
    <>
      <Paper
        sx={{ width: "200px", background: "#808080", p: 1, m: 2 }}
        onClick={() => setActiveJob()}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Typography>{job.getName()}</Typography>
          <Typography>Lvl: {job.getLevel()}</Typography>
        </div>
        <LinearProgress
          variant={"determinate"}
          value={job.getProgressPercentage()}
          sx={{ mb: 1 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography>{job.getProgressPercentage().toFixed(0)}%</Typography>
          <Typography>{job.getIncome().toPrecision(1)}c</Typography>
        </div>
      </Paper>
    </>
  );
}
