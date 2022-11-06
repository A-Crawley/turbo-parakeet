import { Divider, Paper, Popover, Typography } from "@mui/material";
import { useState } from "react";

interface Properties {
  name: string | undefined;
  message: string | undefined;
  date: Date | undefined;
}

export const Message = (props: Properties | undefined) => {
  return (
    <>
      <Paper
        style={{
          width: "100%",
          minHeight: "55px",
          padding: "4px 8px",
          borderRadius: "0",
        }}
        elevation={1}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant={"body2"}>{props?.name}</Typography>
            <Typography variant={"body2"}>
              {props?.date?.toLocaleDateString()}
              {" - "}
              {props?.date?.toLocaleTimeString()}
            </Typography>
          </div>
          <Divider />
        </div>
        <div style={{ marginTop: "8px" }}>
          <Typography>{props?.message}</Typography>
        </div>
      </Paper>
    </>
  );
};
