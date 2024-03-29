import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
} from "@mui/material";

import { useActiveUser } from "store";
import { socialService } from "services";
import { GoalTypes, SocialTypes } from "types";
import { Id } from "types/apiTypes";

import { ParsedError } from "components/atoms";
import { GoalTeaserReduced } from "components/organisms";
import { MediaForm } from "components/templates";

const PostForm = (props: { relatedGoal?: GoalTypes.Goal }) => {
  const navigate = useNavigate();

  const [mediaId, setMediaId] = useState<Id | undefined>(undefined);

  const hasRelatedGoal = !!props.relatedGoal;

  const {
    mutate: createPost,
    isLoading,
    isError,
    error,
  } = socialService.useCreatePost();

  const { activeUser } = useActiveUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialTypes.Post>();

  const onCreatePost = (post: SocialTypes.Post) => {
    if (activeUser?.id)
      createPost(
        { ...post, createdBy: activeUser?.id, goal: props.relatedGoal?.id },
        {
          onSuccess: () => {
            hasRelatedGoal
              ? navigate("/goals/" + props.relatedGoal?.id + "/feed")
              : navigate("/users/" + activeUser?.id + "/feed");
          },
        }
      );
  };

  const onSubmit = (formValues: SocialTypes.Post) => {
    if (formValues) {
      onCreatePost({ ...formValues, media: mediaId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex flex-col gap-3">
        {props.relatedGoal && <GoalTeaserReduced {...props.relatedGoal} />}

        <MediaForm onUploadFinished={(mediaId?: Id) => setMediaId(mediaId)} />

        <Controller
          name="title"
          rules={{
            required: "Obligatorio",
            maxLength: { value: 30, message: "Es demasiado largo, max 30" },
          }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Título" {...field} />
              {errors.title && (
                <FormHelperText error>{errors.title.message}</FormHelperText>
              )}
            </div>
          )}
        />
        <Controller
          name="content"
          rules={{
            required: "Obligatorio",
            maxLength: { value: 1250, message: "Es demasiado largo, max 1250" },
          }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Contenido" multiline rows={8} {...field} />
              {errors.content && (
                <FormHelperText error>{errors.content.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          {isLoading ? <CircularProgress size={16} /> : "Crear"}
        </Button>
      </div>
      {isLoading && <FormHelperText>Guardando...</FormHelperText>}
      {isError && <ParsedError {...error} />}
    </form>
  );
};

export default PostForm;
