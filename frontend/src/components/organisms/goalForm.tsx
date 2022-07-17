import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import { useActiveUser, useNotificationStore } from "store";
import { goalService } from "services";
import { GoalTypes } from "types";

import { ParsedError } from "components/atoms";

const GoalForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const {
    mutate: createGoal,
    isLoading,
    isError,
    error,
  } = goalService.useCreateGoal();

  const { mutate: createParticipation, isLoading: loadingParticipation } =
    goalService.useCreateParticipation();

  const { activeUser } = useActiveUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalTypes.Goal>();

  const onSubmit = (formValues: GoalTypes.Goal) => {
    if (formValues)
      createGoal(
        { ...formValues, createdBy: activeUser?.id },
        {
          onSuccess: (data) =>
            createParticipation(
              {
                goal: data.id,
                user: activeUser?.id,
              },
              {
                onSuccess: () => {
                  addNotification({
                    title: "Objetivo creado",
                    content:
                      "Ahora añade tus objetivos temporales y empieza a cumplirlos!",
                    type: "transient",
                  });
                  navigate("/home/" + data.id + "/objectives");
                },
              }
            ),
        }
      );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex flex-col gap-3">
        <Controller
          name="title"
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Título" {...field} />
              {errors.title && (
                <FormHelperText error>{errors.title.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="description"
          rules={{ maxLength: 1500 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Descripción" multiline {...field} />
              {errors.description && (
                <FormHelperText error>
                  {errors.description.message || "Demasiado largo"}
                </FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="unit"
          rules={{ required: "Obligatorio", maxLength: 10 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Unidad" {...field} />
              {errors.unit && (
                <FormHelperText error>
                  {errors.unit.message || "Demasiado largo"}
                </FormHelperText>
              )}
            </div>
          )}
        />

        <InputLabel htmlFor="type">Tipo</InputLabel>
        <Controller
          name="type"
          rules={{ required: "Obligatorio" }}
          control={control}
          render={({ field }) => (
            <div>
              <RadioGroup row {...field}>
                <FormControlLabel
                  value="GoalType.PRIVATE"
                  control={<Radio />}
                  label="Privado"
                />
                <FormControlLabel
                  value="GoalType.CHALLENGE"
                  control={<Radio />}
                  label="Reto"
                />
                <FormControlLabel
                  value="GoalType.COOP"
                  control={<Radio />}
                  label="Cooperativo"
                />
              </RadioGroup>
              {errors.type && (
                <FormHelperText error>{errors.type.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          <strong>Confirmar</strong>
          {isLoading && <CircularProgress size={20} />}
        </Button>
      </div>
      {isLoading && <FormHelperText>Guardando...</FormHelperText>}
      {loadingParticipation && (
        <FormHelperText>Creando participación...</FormHelperText>
      )}
      {isError && <ParsedError {...error} />}
    </form>
  );
};

export default GoalForm;
