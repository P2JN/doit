import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";

import { useActiveUser, useNotificationStore } from "store";
import { goalService } from "services";

const TrackingForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const {
    mutate: createTracking,
    isLoading,
    isError,
    error,
  } = goalService.useCreateTracking();

  const { goalId } = useParams();
  const { activeUser } = useActiveUser();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      amount: 1,
    },
  });

  const onSubmit = (data: { amount: number }) => {
    if (goalId && activeUser?.id && data.amount)
      createTracking(
        {
          goal: goalId,
          user: activeUser.id,
          amount: data.amount,
        },
        {
          onSuccess: () => {
            addNotification({
              title: "Avance guardado con éxito",
              content: "Felicidades, sigue así!",
              type: "transient",
            });
            navigate("/home?refresh=" + goalId);
          },
        }
      );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex items-center justify-between">
        <Controller
          name="amount"
          rules={{ required: true, min: 1 }}
          control={control}
          render={({ field }) => (
            <TextField label="Cantidad" type="number" {...field} />
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          <strong>Submit</strong>
          {isLoading && <CircularProgress size={20} />}
        </Button>
      </div>
      {isError && <Alert severity="error">{error.message}</Alert>}
    </form>
  );
};

export default TrackingForm;
