import { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const Component = (props: {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}) => {
  return (
    <Dialog open={true} className="hidden md:inline">
      <div className="min-w-[400px]">
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          {!!props.onClose && (
            <Button
              variant="text"
              onClick={() => !!props.onClose && props.onClose()}
            >
              Cerrar
            </Button>
          )}
          {!!props.onConfirm && (
            <Button
              variant="outlined"
              onClick={() => !!props.onConfirm && props.onConfirm()}
            >
              Confirmar
            </Button>
          )}
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default Component;
