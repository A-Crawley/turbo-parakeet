import { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ChevronRight } from "@mui/icons-material";
import { Button, Input, Paper, TextField } from "@mui/material";
import { Message } from "./chatMessage";
import {
  getMessages,
  messageSubscribe,
  sendChatRoomMessage,
} from "../supabaseClient";

export default function Chat() {
  const [hidden, setHidden] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesRef = useRef<any[]>([]);
  messagesRef.current = messages;

  useEffect(() => {}, [hidden, message, messages]);

  useEffect(() => {
    getMessages().then((response) => {
      if (response.data === null) return;
      setMessages(response.data);
    });

    messageSubscribe((x) => {
      setMessages([...messagesRef.current, x.new]);
    });
  }, []);

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
    await sendChatRoomMessage(message);
    setMessage("");
    (document.getElementById("input") as HTMLInputElement).value = "";
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "5vh",
          right: 0,
          display: "flex",
          overflowX: "hidden",
        }}
      >
        <Paper
          style={{
            position: "relative",
            width: "30px",
            height: "50px",
            background: "white",
            borderRadius: "5px 0 0 5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            zIndex: 9999,
            marginRight: "-8px",
          }}
          elevation={0}
          onClick={() => setHidden(!hidden)}
        >
          <ChevronLeftIcon style={{ display: hidden ? "block" : "none" }} />
          <ChevronRight style={{ display: hidden ? "none" : "block" }} />
        </Paper>
        <Paper
          style={{
            position: "relative",
            display: hidden ? "none" : "flex",
            flexDirection: "column",
            height: "90vh",
            width: "400px",
            padding: "8px",
          }}
        >
          <Paper
            id="chat-log"
            style={{
              width: "100%",
              height: "100%",
              background: "#00000011",
              overflowY: "scroll",
              padding: "8px 0",
            }}
            elevation={0}
          >
            {messages.map((value) => {
              return (
                <div key={value.id} style={{ marginBottom: "8px" }}>
                  <Message
                    name={value.user_name}
                    date={new Date(value.created_at)}
                    message={value.message}
                  />
                </div>
              );
            })}
              <div id="anchor"></div>
          </Paper>
          <div
            className="chat-input"
            style={{
              width: "100%",
              height: "40px",
              marginTop: "8px",
              borderRadius: "0 0 0 5px",
            }}
          >
            <form style={{ display: "flex" }} onSubmit={submit}>
              <TextField
                type={"text"}
                size={"small"}
                style={{ flex: 4 }}
                onChange={handleMessageChange}
                id={"input"}
              />
              <Button
                variant={"contained"}
                fullWidth={true}
                style={{ flex: 1 }}
                onClick={sendMessage}
              >
                Send
              </Button>
            </form>
          </div>
        </Paper>
      </div>
    </>
  );
}
