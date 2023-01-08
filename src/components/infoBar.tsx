import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface props {
  name?: string;
  date?: string;
}

export function InfoBar(props: props) {
  return (
    <>
      <AppBar position={"static"}>
        <Toolbar>
          <IconButton
            size={"large"}
            edge={"start"}
            color={"inherit"}
            aria-label={"menu"}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Loop Life
          </Typography>
          <div style={{ display: "flex" }}>
            <span
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                marginRight: "25px",
              }}
            >
              {props.date ?? ""}
            </span>
            <Tooltip title={props.name ?? ""}>
              <Avatar sx={{ color: "inherit" }}>G</Avatar>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
