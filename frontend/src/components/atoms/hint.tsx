import { ReactNode, useState } from "react";
import { Assistant } from "@mui/icons-material";
import { Alert } from "@mui/material";

const Hint = (props: { id: string; children: ReactNode; hidden?: boolean }) => {
  const [hidden, setHidden] = useState(
    localStorage.getItem("hint-" + props.id) === "true"
  );

  const onClose = () => {
    localStorage.setItem("hint-" + props.id, "true");
    setHidden(true);
  };

  return (
    <>
      {!hidden && !props.hidden && (
        <Alert
          severity="success"
          variant="outlined"
          icon={<Assistant />}
          className="w-full"
          onClose={onClose}
        >
          {props.children}
        </Alert>
      )}
    </>
  );
};

export default Hint;
