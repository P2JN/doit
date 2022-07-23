import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { errors },
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
          onSuccess: () => setSearchParams("?refresh=" + props.postId),
        }
      );
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
          {isLoading && <CircularProgress />}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
