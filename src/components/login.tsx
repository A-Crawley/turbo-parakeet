import {
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { guestLogin, login, register } from "../supabaseClient";

interface props {
  loggedIn: Function | null;
}

export default function Login(props: props | null) {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [showUsername, setShowUsername] = useState<boolean>();

    const [usernameError, setUsernameError] = useState<boolean>();
    const [emailError, setEmailError] = useState<boolean>();
    const [passwordError, setPasswordError] = useState<boolean>();

    const handleUsernameChange = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
        setUsername(event.target.value);
        if(usernameError) setUsernameError(false);
    };

    const handleEmailChange = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
        setEmail(event.target.value);
        if (emailError) setEmailError(false);
    };

    const handlePasswordChange = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
        setPassword(event.target.value);
        if(passwordError) setPasswordError(false);
    };

    const handleLogin = async () => {
        let invalid = true;

        if(email === undefined || email === null || !email.includes('@')){
            setEmailError(true);
            invalid = true;
        } else {
            setEmailError(false);
            invalid = false;
        }

        if(password === undefined || password === null || password.length < 8){
            setPasswordError(true);
            invalid = true;
        } else {
            setPasswordError(false);
            invalid = false;
        }

        if(showUsername && (username === undefined || username === null)){
            setUsernameError(true);
            invalid = true;
        } else {
            setUsernameError(false);
            invalid = false;
        }

        if (invalid || email === undefined || password === undefined) return;

        if (showUsername && username !== undefined){
            const response = await register(email, password, username);

            if (response !== null) {
                console.error(response);
                return;
            }
        } else {
            const response = await login(email, password);

            if (response !== null) {
                console.error(response);
                return;
            }
        }

        if (props !== null && props.loggedIn !== null) props.loggedIn();
    };

    const continueAsGuest = async () => {
        await guestLogin();
        if (props !== null && props.loggedIn !== null) props.loggedIn();
    };

    const handleRegisterClick = () => {
        setShowUsername(true);
    }

    return (
            <>
            <Paper
                style={{
                padding: "16px",
                    marginLeft: "calc(50vw - 200px)",
                    marginTop: "calc(50vh - 300px)",
                    height: "600px",
                    width: "400px",
                    display: "flex",
                    flexDirection: "column",
                }}
                elevation={4}
                >
                <div>
                    <Typography align={"center"} variant={"h3"}>
                        Loop Life
                    </Typography>
                </div>
                <form style={{ marginTop: "32px" }}>
                    <TextField
                        label={"username"}
                        type={"text"}
                        fullWidth={true}
                        style={{ display: showUsername ? "block" : "none" }}
                        required={showUsername}
                        error={usernameError}
                        helperText={usernameError ? "Must provide a valid username" : ""}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        label={"email"}
                        type={"email"}
                        fullWidth={true}
                        required={true}
                        style={{ marginTop: "8px" }}
                        error={emailError}
                        helperText={emailError ? "Must provide a valid email" : ""}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        label={"password"}
                        type={"password"}
                        fullWidth={true}
                        required={true}
                        error={passwordError}
                        helperText={passwordError ? "Must provide a valid password ( > 8 Characters )" : ""}
                        style={{ marginTop: "8px" }}
                        onChange={handlePasswordChange}
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
                            onClick={handleLogin}
                            >
                            LOGIN
                        </Button>
                        <Button
                            style={{ marginTop: "8px" }}
                            variant={"contained"}
                            disabled={true}
                            >
                            FORGOT PASSWORD
                        </Button>
                    </div>
                </form>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "auto"
                    }}
                    >
                    <Button
                        style={{ marginBottom: "8px" }}
                        variant={"contained"}
                        onClick={handleRegisterClick}
                        disabled={showUsername}
                        >
                        REGISTER
                    </Button>
                    <Button
                        fullWidth={true}
                        variant={"contained"}
                        onClick={continueAsGuest}
                        >
                        CONTINUE AS GUEST
                    </Button>

                </div
                    >
            </Paper>
            </>
            );
}
