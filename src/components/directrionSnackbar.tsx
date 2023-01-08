import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

interface props {
  open: boolean;
  close: any;
  duration?: number;
  message?: string;
  origin?: SnackbarOrigin;

  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
}

export default function DirectionSnackbar(props: props) {
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  React.useEffect(() => {
    if (props.down) setTransition(() => TransitionDown);
    else if (props.up) setTransition(() => TransitionUp);
    else if (props.left) setTransition(() => TransitionLeft);
    else if (props.right) setTransition(() => TransitionRight);
    else setTransition(() => TransitionLeft);
  }, [props]);

  return (
    <>
      <Snackbar
        open={props.open}
        onClose={props.close}
        autoHideDuration={props.duration ?? 1}
        TransitionComponent={transition}
        anchorOrigin={
          props.origin ?? { vertical: "bottom", horizontal: "left" }
        }
        message={props.message ?? "I love snacks"}
        key={transition ? transition.name : ""}
      />
    </>
  );
}
