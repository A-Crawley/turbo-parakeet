import { CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface props {
  hidden?: boolean;
}

export function LoadingDialog(props: props) {
  const [customDisplay, setCustomDisplay] = useState<string>("flex");

  useEffect(() => {
    if (props.hidden === true) {
      setCustomDisplay("none");
      return;
    }
  }, [props]);

  return (
    <>
      <Paper
        style={{
          position: "absolute",
          padding: "16px",
          marginLeft: "calc(50vw - 75px)",
          marginTop: "calc(50vh - 100px)",
          height: "150px",
          width: "200px",
          display: customDisplay,
          flexDirection: "column",
        }}
        elevation={4}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            align={"center"}
            variant={"h4"}
            style={{ marginBottom: "30px" }}
          >
            Loop Life
          </Typography>
          <CircularProgress style={{ margin: "auto" }} />
        </div>
      </Paper>
    </>
  );
}
