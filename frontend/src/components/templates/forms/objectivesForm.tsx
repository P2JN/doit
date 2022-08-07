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

import { Loader, ParsedError } from "components/atoms";
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalTypes.Progress>({
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

    setTimeout(() => {
      if (isUpdate) navigate("/goals/" + goalId + "/info?refresh=goal");
      else navigate("/home?refresh=goals");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isUpdate && (
        <>
          {loadingGoal && <Loader />}
          {goal && <GoalTeaserInfo {...goal} />}

          <Divider className="!my-2" />
          <Typography variant="h5">Añade tus objetivos</Typography>
          <Typography variant="body1">
            También puedes hacerlo más tarde
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
              rules={{
                min: {
                  message: "El valor no puede ser menor que 0",
                  value: 0,
                },
              }}
              render={({ field }) => (
                <div className="flex w-full flex-col">
                  <TextField
                    type="number"
                    label={texts.objectiveLabels[type as GoalTypes.Frequency]}
                    {...field}
                  />
                  {errors[type as GoalTypes.Frequency] && (
                    <FormHelperText error>
                      {errors[type as GoalTypes.Frequency]?.message}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          )
        )}

        <Button size="large" variant="outlined" type="submit">
          {isLoading ? (
            <CircularProgress size={16} />
          ) : isUpdate ? (
            "Actualizar"
          ) : (
            "Guardar"
          )}
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
