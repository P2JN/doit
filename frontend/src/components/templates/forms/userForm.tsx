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

const UserForm = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const {
    mutate: createUser,
    isLoading,
    isError,
    error,
  } = socialService.useCreateUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialTypes.User>();

  const onSubmit = (formValues: SocialTypes.User) => {
    localStorage.removeItem("token");
    if (formValues)
      createUser(formValues, {
        onSuccess: () => {
          addNotification({
            title: "Registro completado, bienvenido!",
            content: "Ya puedes comenzar a crear objetivos!",
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
          rules={{ required: "Obligatorio", maxLength: 100 }}
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
          name="first_name"
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Nombre" {...field} />
              {errors.firstName && (
                <FormHelperText error>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="last_name"
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Apellidos" {...field} />
              {errors.lastName && (
                <FormHelperText error>{errors.lastName.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="email"
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField type="email" label="Email" {...field} />
              {errors.email && (
                <FormHelperText error>{errors.email.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="password1"
          rules={{ required: "Obligatorio", minLength: 8 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField type="password" label="Contraseña" {...field} />
              {errors.password1 && (
                <FormHelperText error>
                  {errors.password1.message}
                </FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name="password2"
          rules={{ required: "Obligatorio", minLength: 8 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField
                type="password"
                label="Confirmar Contraseña"
                {...field}
              />
              {errors.password2 && (
                <FormHelperText error>
                  {errors.password2.message}
                </FormHelperText>
              )}
            </div>
          )}
        />

        <Button size="large" variant="outlined" type="submit">
          {isLoading ? <CircularProgress size={16} /> : "Confirmar"}
        </Button>
      </div>
      {isLoading && <FormHelperText>Guardando...</FormHelperText>}
      {isError && <ParsedError {...error} />}
    </form>
  );
};

export default UserForm;
