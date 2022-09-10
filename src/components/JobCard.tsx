import { LinearProgress, Paper, Typography } from "@mui/material";

interface JobCardProps{

    name: string;
    setActiveJob: Function;
    level: number;
    progressPercentage: number;
    progress: number;
    progressNeededToNextLevel: number;
  }
  
export default function JobCard(props: JobCardProps){
  
  
    return (
      <>
  
          <Paper sx={{ width: "200px", background: "#808080" }} onClick={() => props.setActiveJob()}>
            <div>{props.name}: {props.level}</div>
            <LinearProgress variant={'determinate'} value={props.progressPercentage} />
            <Typography>{props.progress.toFixed(0)}/{props.progressNeededToNextLevel}</Typography>
          </Paper>
  
      </>
    )
  }