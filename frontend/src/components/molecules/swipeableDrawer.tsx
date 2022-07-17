import { ReactNode } from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Typography } from "@mui/material";

const drawerBleeding = 30;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function Component(props: {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={true}
        onClose={() => props.onClose && props.onClose()}
        onOpen={() => null}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        className="md:hidden"
      >
        <div className="absolute bottom-full w-full rounded-t-lg bg-white px-4 py-3">
          <Puller />
        </div>
        <div className="block overflow-y-auto rounded-t-lg px-4 py-2">
          <Typography variant="h4">{props.title}</Typography>
          <br />

          {props.children}
        </div>
      </SwipeableDrawer>
    </>
  );
}
