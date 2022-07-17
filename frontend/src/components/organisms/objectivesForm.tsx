import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

import { useNotificationStore } from "store";
import { goalService } from "services";
import { GoalTypes } from "types";

import { ParsedError } from "components/atoms";
import { GoalTeaserInfo } from "components/organisms";

const ObjectivesForm = () => {
  const { goalId } = useParams();
  const { data: goal, isLoading: loadingGoal } = goalService.useGoal(goalId);

  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const [toCreate, setToCreate] = useState(-1);
  const [created, setCreated] = useState(0);

  const {
    mutate: createObjective,
    isLoading,
    isError,
    error,
  } = goalService.useCreateObjective();

  const { control, handleSubmit } = useForm<GoalTypes.Progress>();

  const onSubmit = (formValues: GoalTypes.Progress) => {
    setToCreate(
      Object.values(formValues).reduce((a, b) => a + (b && b > 0 ? 1 : 0), 0)
    );
    if (goalId && formValues)
      Object.entries(formValues).forEach(([key, value]) => {
        if (value && value > 0) {
          createObjective(
            {
              goal: goalId,
              quantity: value,
              frequency: ("Frequency." +
                key.toUpperCase()) as GoalTypes.FrequencyEnumValues,
            },
            {
              onSuccess: () => setCreated(created + 1),
            }
          );
        }
      });
  };

  useEffect(() => {
    if (!isError && !isLoading && created === toCreate) {
      addNotification({
        title: "Objetivos temporales añadidos",
        content: "Ya puedes empezar a generar progreso!",
        type: "transient",
      });
      navigate("/home?refresh=goals");
    }
  }, [isLoading, isError, created, toCreate, addNotification, navigate]);

  const labels = ["Diario", "Semanal", "Mensual", "Anual", "Total"];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loadingGoal && <CircularProgress />}
      {goal && <GoalTeaserInfo {...goal} />}

      <Divider className="!my-2" />
      <Typography variant="h5">Añade tus objetivos</Typography>
      <Typography variant="body1">También puedes hacerlo más tarde</Typography>

      <div className="my-2 flex flex-col gap-3">
        {["daily", "weekly", "monthly", "yearly", "total"].map(
          (type, index) => (
            <Controller
              key={type + index}
              name={type as GoalTypes.Frequency}
              control={control}
              render={({ field }) => (
                <TextField type="number" label={labels[index]} {...field} />
              )}
            />
          )
        )}

        <Button size="large" variant="outlined" type="submit">
          <strong>Confirmar</strong>
          {isLoading && <CircularProgress size={20} />}
        </Button>
      </div>
      {isLoading && <FormHelperText>Guardando...</FormHelperText>}
      {isError && <ParsedError {...error} />}
    </form>
  );
};

export default ObjectivesForm;
