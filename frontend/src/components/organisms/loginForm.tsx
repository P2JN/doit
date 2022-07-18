import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
} from "@mui/material";

import { useNotificationStore } from "store";
import { socialService } from "services";
import { SocialTypes } from "types";

import { ParsedError } from "components/atoms";

const LogInForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const {
    mutate: logInUser,
    isLoading,
    isError,
    error,
  } = socialService.useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialTypes.LogIn>();

  const onSubmit = (formValues: SocialTypes.LogIn) => {
    if (formValues)
      logInUser(formValues, {
        onSuccess: () => {
          addNotification({
            title: "Bienvenido de nuevo",
            content: "Empecemos a cumplir objetivos!",
            type: "transient",
          });
          navigate("/loading");
          setTimeout(() => navigate("/home"), 1000);
        },
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex flex-col gap-3">
        <Controller
          name="username"
          rules={{ required: "Obligatorio" }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Nombre de usuario" {...field} />
              {errors.username && (
                <FormHelperText error>{errors.username.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="password"
          rules={{ required: "Obligatorio" }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField type="password" label="Contraseña" {...field} />
              {errors.username && (
                <FormHelperText error>{errors.username.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          <strong>Confirmar</strong>
          {isLoading && <CircularProgress size={20} />}
        </Button>
      </div>
      {isLoading && <FormHelperText>Guardando...</FormHelperText>}
      {isError && <ParsedError {...error} />}
    </form>
  );
};

export default LogInForm;
