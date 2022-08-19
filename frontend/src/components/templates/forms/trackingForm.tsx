import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
} from "@mui/material";

import { useActiveUser } from "store";
import { goalService } from "services";

import { ParsedError } from "components/atoms";

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
      <div className="mb-2 flex flex-col gap-4">
        <Controller
          name="amount"
          rules={{
            required: true,
            min: {
              value: 1,
              message: "No puede ser negativo ni 0",
            },
          }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Cantidad" type="number" {...field} />
              {errors.amount && (
                <FormHelperText error>{errors.amount.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          {isLoading ? <CircularProgress size={16} /> : "Registrar"}
        </Button>
      </div>
      {isError && <ParsedError {...error} />}
    </form>
  );
};

export default TrackingForm;
