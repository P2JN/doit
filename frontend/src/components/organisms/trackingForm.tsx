import { Controller, useForm } from "react-hook-form";
import { useMatch } from "react-router-dom";
import { TextField } from "@mui/material";

const TrackingForm = () => {
  const goalId = useMatch("/home/:goalId/track");

  const { control, handleSubmit } = useForm({
    defaultValues: {
      quantity: 0,
      user: "",
      date: new Date(),
      goal: goalId,
    },
  });
  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="quantity"
        control={control}
        render={({ field }) => <TextField type="number" {...field} />}
      />
    </form>
  );
};

export default TrackingForm;
