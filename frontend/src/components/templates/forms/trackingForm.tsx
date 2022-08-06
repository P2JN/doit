import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";

import { useActiveUser } from "store";
import { goalService } from "services";

const TrackingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          createdBy: activeUser.id,
          amount: data.amount,
        },
        {
          onSuccess: () => {
            navigate(
              location.pathname.split("/").slice(0, -1).join("/") +
                "?refresh=" +
                goalId
            );
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
          {isLoading ? <CircularProgress size={16} /> : "Registrar"}
        </Button>
      </div>
      {isError && <Alert severity="error">{error.message}</Alert>}
    </form>
  );
};

export default TrackingForm;
