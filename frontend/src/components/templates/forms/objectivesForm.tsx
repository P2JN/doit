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
import { formParsers, texts } from "utils";

import { ParsedError } from "components/atoms";
import { GoalTeaserInfo } from "components/organisms";

const ObjectivesForm = (props: { initial?: GoalTypes.Objective[] }) => {
  const { goalId } = useParams();
  const { data: goal, isLoading: loadingGoal } = goalService.useGoal(goalId);

  const isUpdate = !!props.initial;

  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const {
    mutate: createObjective,
    isLoading,
    isError,
    error,
  } = goalService.useCreateObjective();

  const {
    mutate: updateObjective,
    isLoading: loadingUpdate,
    isError: isUpdateError,
    error: updateError,
  } = goalService.useUpdateObjective();

  const {
    mutate: deleteObjective,
    isLoading: loadingDelete,
    isError: isDeleteError,
    error: deleteError,
  } = goalService.useDeleteObjective();

  const { control, handleSubmit } = useForm<GoalTypes.Progress>({
    defaultValues: formParsers.fromGoalObjectivesToFormValues(props.initial),
  });

  const onCreate = (frequency: string, quantity: number) => {
    if (goalId && quantity && quantity > 0) {
      createObjective(
        {
          goal: goalId,
          quantity,
          frequency: formParsers.fromFrequencyToEnumValue(
            frequency as GoalTypes.Frequency
          ),
        },
        {
          onError: (error) => {
            addNotification({
              title: "Error al crear objetivo",
              content: error.message,
              type: "transient",
              variant: "error",
            });
          },
        }
      );
    }
  };

  const onUpdate = (objective: GoalTypes.Objective, quantity: number) => {
    if (goalId && quantity && quantity > 0) {
      updateObjective(
        {
          ...objective,
          quantity,
          frequency: formParsers.fromFrequencyToEnumValue(
            objective.frequency as GoalTypes.Frequency
          ),
        },
        {
          onError: (error) => {
            addNotification({
              title: "Error al actualizar objetivo",
              content: error.message,
              type: "transient",
              variant: "error",
            });
          },
        }
      );
    }
  };

  const onDelete = (objectiveId?: string) => {
    if (goalId && objectiveId) {
      deleteObjective(objectiveId);
    }
  };

  const onSubmit = (formValues: GoalTypes.Progress) => {
    Object.entries(formValues).forEach(([key, value]) => {
      if (!isUpdate) onCreate(key, value);
      else {
        const existingObjective = goal?.objectives?.find(
          (o) => o.frequency === key
        );
        if (existingObjective) {
          if (existingObjective.quantity !== value) {
            if (value && value > 0) onUpdate(existingObjective, value);
            else onDelete(existingObjective.id as string);
          }
        } else onCreate(key, value);
      }
    });

    addNotification({
      title: "Listo!",
      content: "Ya puedes empezar a generar progreso!",
      type: "transient",
    });

    setTimeout(() => {
      if (isUpdate) navigate("/goals/" + goalId + "/info?refresh=goal");
      else navigate("/home?refresh=goals");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isUpdate && (
        <>
          {loadingGoal && <CircularProgress />}
          {goal && <GoalTeaserInfo {...goal} />}

          <Divider className="!my-2" />
          <Typography variant="h5">A??ade tus objetivos</Typography>
          <Typography variant="body1">
            Tambi??n puedes hacerlo m??s tarde
          </Typography>
        </>
      )}
      <div className="my-2 flex flex-col gap-3">
        {["daily", "weekly", "monthly", "yearly", "total"].map(
          (type, index) => (
            <Controller
              key={type + index}
              name={type as GoalTypes.Frequency}
              control={control}
              render={({ field }) => (
                <TextField
                  type="number"
                  label={texts.objectiveLabels[type as GoalTypes.Frequency]}
                  {...field}
                />
              )}
            />
          )
        )}

        <Button size="large" variant="outlined" type="submit">
          <strong>{isUpdate ? "Actualizar" : "Guardar"}</strong>
          {isLoading && <CircularProgress size={20} />}
        </Button>
      </div>
      {(isLoading || loadingDelete || loadingUpdate) && (
        <FormHelperText>Guardando...</FormHelperText>
      )}
      {isError && <ParsedError {...error} />}
      {isUpdateError && <ParsedError {...updateError} />}
      {isDeleteError && <ParsedError {...deleteError} />}
    </form>
  );
};

export default ObjectivesForm;
