import { ReactNode } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const Component = (props: {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
}) => {
  return (
    <Dialog
      open={true}
      className="hidden md:inline"
      onClose={props.onClose}
      closeAfterTransition
    >
      <div className="min-w-[400px]">
        <div className="flex items-center justify-between">
          <DialogTitle>{props.title}</DialogTitle>
          <DialogActions>
            <IconButton onClick={props.onClose}>
              <Close />
            </IconButton>
          </DialogActions>
        </div>
        <DialogContent>{props.children}</DialogContent>
      </div>
    </Dialog>
  );
};

export default Component;
