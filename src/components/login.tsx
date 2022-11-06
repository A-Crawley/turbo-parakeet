import {
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { guestLogin } from "../supabaseClient";

interface props {
  loggedIn: Function | null;
}

export default function Login(props: props | null) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login();
  };

  const login = () => {
    console.log({ email, password });
  };

  const continueAsGuest = async () => {
    await guestLogin();
    if (props !== null && props.loggedIn !== null) props.loggedIn();
  };

  return (
    <>
      <Paper
        style={{
          padding: "16px",
          marginLeft: "calc(50vw - 200px)",
          marginTop: "calc(50vh - 250px)",
          height: "500px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        elevation={4}
      >
        <div>
          <Typography align={"center"} variant={"h3"}>
            Loop Life
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label={"email"}
            type={"email"}
            fullWidth={true}
            disabled={true}
          />
          <TextField
            label={"password"}
            type={"password"}
            fullWidth={true}
            style={{ marginTop: "8px" }}
            disabled={true}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              style={{ marginTop: "8px" }}
              variant={"contained"}
              type={"submit"}
              disabled={true}
            >
              LOGIN
            </Button>
            <Button
              style={{ marginTop: "8px" }}
              variant={"contained"}
              type={"submit"}
              disabled={true}
            >
              REGISTER
            </Button>
            <Button
              style={{ marginTop: "8px" }}
              variant={"contained"}
              type={"submit"}
              disabled={true}
            >
              FORGOT PASSWORD
            </Button>
          </div>
        </form>
        <div>
          <Button
            fullWidth={true}
            variant={"contained"}
            onClick={continueAsGuest}
          >
            CONTINUE AS GUEST
          </Button>
        </div>
      </Paper>
    </>
  );
}
