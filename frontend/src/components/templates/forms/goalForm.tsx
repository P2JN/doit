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
import { formParsers, texts } from "utils";

import { ParsedError } from "components/atoms";

const GoalForm = (props: { initial?: GoalTypes.Goal; disabled?: boolean }) => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const isUpdate = !!props.initial;

  const {
    mutate: createGoal,
    isLoading,
    isError,
    error,
  } = goalService.useCreateGoal();

  const {
    mutate: updateGoal,
    isLoading: loadingUpdate,
    isError: isUpdateError,
    error: updateError,
  } = goalService.useUpdateGoal();

  const { mutate: createParticipation, isLoading: loadingParticipation } =
    goalService.useCreateParticipation();

  const { activeUser } = useActiveUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalTypes.Goal>({
    defaultValues:
      {
        ...props.initial,
        type: formParsers.fromGoalTypeToEnumValue(
          props.initial?.type as GoalTypes.GoalType
        ),
      } || {},
  });

  const onCreateGoal = (goal: GoalTypes.Goal) => {
    createGoal(
      { ...goal, createdBy: activeUser?.id },
      {
        onSuccess: (data) =>
          createParticipation(
            {
              goal: data.id,
              createdBy: activeUser?.id,
            },
            {
              onSuccess: () => {
                navigate("/home/" + data.id + "/objectives");
              },
            }
          ),
      }
    );
  };

  const onUpdateGoal = (goal: GoalTypes.Goal) => {
    updateGoal(goal, {
      onSuccess: () => {
        addNotification({
          title: "Meta actualizada",
          content: "Los datos de tu meta se han actualizado correctamente",
          type: "transient",
        });
        navigate("/goals/" + goal.id + "/info?refresh=goal");
      },
    });
  };

  const onSubmit = (formValues: GoalTypes.Goal) => {
    if (formValues) {
      if (isUpdate) onUpdateGoal(formValues);
      else onCreateGoal(formValues);
    }
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
              <TextField disabled={props.disabled} label="Título" {...field} />
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
              <TextField
                disabled={props.disabled}
                label="Descripción"
                multiline
                {...field}
              />
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
              <TextField disabled={props.disabled} label="Unidad" {...field} />
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
                  control={<Radio disabled={props.disabled} />}
                  label={texts.goalTypes["private"]}
                />
                <FormControlLabel
                  value="GoalType.CHALLENGE"
                  control={<Radio disabled={props.disabled} />}
                  label={texts.goalTypes["challenge"]}
                />
                <FormControlLabel
                  value="GoalType.COOP"
                  control={<Radio disabled={props.disabled} />}
                  label={texts.goalTypes["cooperative"]}
                />
              </RadioGroup>
              {errors.type && (
                <FormHelperText error>{errors.type.message}</FormHelperText>
              )}
            </div>
          )}
        />

        {!props.disabled && (
          <Button size="large" variant="outlined" type="submit">
            {isLoading ? (
              <CircularProgress size={16} />
            ) : isUpdate ? (
              "Actualizar"
            ) : (
              "Crear"
            )}
          </Button>
        )}
      </div>
      {(isLoading || loadingUpdate) && (
        <FormHelperText>Guardando...</FormHelperText>
      )}
      {loadingParticipation && (
        <FormHelperText>Creando participación...</FormHelperText>
      )}
      {isError && <ParsedError {...error} />}
      {isUpdateError && <ParsedError {...updateError} />}
    </form>
  );
};

export default GoalForm;
