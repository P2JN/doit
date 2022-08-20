import { Controller, useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
} from "@mui/material";

import { socialService } from "services";
import { Id } from "types/apiTypes";
import { useActiveUser } from "store";

const CommentForm = (props: { postId?: Id }) => {
  const { activeUser } = useActiveUser();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<{ message: string }>();

  const { mutate: createComment, isLoading } = socialService.useCreateComment();

  const onSubmit = (data: { message: string }) => {
    if (data.message && activeUser?.id && props.postId)
      createComment(
        {
          content: data.message,
          createdBy: activeUser.id,
          post: props.postId,
        },
        {
          onSuccess: () => {
            setValue("message", "");
          },
        }
      );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-end justify-between gap-3">
        <Controller
          name="message"
          rules={{
            required: "No puedes añadir un comentario vacío",
            maxLength: {
              value: 1250,
              message: "Es demasiado largo, max 1250",
            },
          }}
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
          {isLoading ? <CircularProgress size={16} /> : "Enviar"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
