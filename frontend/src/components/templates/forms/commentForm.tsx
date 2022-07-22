import { Controller, useForm } from "react-hook-form";
import { Button, FormHelperText, TextField } from "@mui/material";

const CommentForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ message: string }>();

  const onSubmit = (data: { message: string }) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-end justify-between gap-3">
        <Controller
          name="message"
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField
                placeholder="Escribe algo aquí..."
                variant="standard"
                size="medium"
                {...field}
              />
              {errors?.message && (
                <FormHelperText error>{errors?.message.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          <strong>Enviar</strong>
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
