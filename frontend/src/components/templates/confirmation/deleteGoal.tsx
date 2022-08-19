import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { goalService } from "services";
import { GoalTypes } from "types";

import { ParsedError } from "components/atoms";

const DeleteGoalConfirmation = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();

  const {
    mutate: deleteGoal,
    isError: isDeleteError,
    error: deleteError,
  } = goalService.useDeleteGoal();

  const [confirmationName, setConfirmationName] = useState("");

  const onDelete = () => {
    goal.id &&
      goal.title === confirmationName &&
      deleteGoal(goal.id, {
        onSuccess: () => navigate("/home"),
      });
  };

  return (
    <>
      <p>¿Estás seguro de que quieres eliminar este objetivo?</p>
      <p>
        Si es así, escribe su nombre ( <strong>{goal.title}</strong> ) para
        confirmar
      </p>
      <div className="mt-4 flex justify-between">
        <TextField
          label="Nombre de confirmación"
          value={confirmationName}
          onChange={(e) => setConfirmationName(e.target.value)}
        />
        <Button color="error" variant="outlined" onClick={onDelete}>
          Eliminar
        </Button>
        {isDeleteError && <ParsedError {...deleteError} />}
      </div>
    </>
  );
};

export default DeleteGoalConfirmation;
