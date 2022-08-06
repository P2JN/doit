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

const UserForm = (props: {
  initial?: SocialTypes.User;
  disabled?: boolean;
}) => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const isUpdate = !!props.initial;

  const {
    mutate: createUser,
    isLoading,
    isError,
    error,
  } = socialService.useCreateUser();

  const {
    mutate: updateUser,
    isLoading: loadingUpdate,
    isError: isUpdateError,
    error: updateError,
  } = socialService.useUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialTypes.User>({
    defaultValues: {
      ...props.initial,
    },
  });

  const onCreate = (user: SocialTypes.User) => {
    localStorage.removeItem("token");
    createUser(user, {
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

  const onUpdate = (user: SocialTypes.User) => {
    updateUser(user, {
      onSuccess: () => {
        addNotification({
          title: "Actualización de perfil completada",
          content: "Has cambiado tus datos de perfil",
          type: "transient",
        });
      },
    });
  };

  const onSubmit = (formValues: SocialTypes.User) => {
    if (formValues)
      if (isUpdate) onUpdate(formValues);
      else onCreate(formValues);
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
              <TextField
                prefix="@"
                label="Nombre de usuario"
                disabled={props.disabled || isUpdate}
                {...field}
              />
              {errors.username && (
                <FormHelperText error>{errors.username.message}</FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name={isUpdate ? "firstName" : "first_name"}
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField label="Nombre" disabled={props.disabled} {...field} />
              {errors.firstName && (
                <FormHelperText error>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </div>
          )}
        />

        <Controller
          name={isUpdate ? "lastName" : "last_name"}
          rules={{ required: "Obligatorio", maxLength: 100 }}
          control={control}
          render={({ field }) => (
            <div className="flex w-full flex-col">
              <TextField
                disabled={props.disabled}
                label="Apellidos"
                {...field}
              />
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
              <TextField
                disabled={props.disabled}
                type="email"
                label="Email"
                {...field}
              />
              {errors.email && (
                <FormHelperText error>{errors.email.message}</FormHelperText>
              )}
            </div>
          )}
        />

        {!isUpdate && (
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
        )}

        {!isUpdate && (
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
        )}

        {!props.disabled && (
          <Button size="large" variant="outlined" type="submit">
            {isLoading ? <CircularProgress size={16} /> : "Confirmar"}
          </Button>
        )}
      </div>
      {(isLoading || loadingUpdate) && (
        <FormHelperText>Guardando...</FormHelperText>
      )}
      {isError && <ParsedError {...error} />}
      {isUpdateError && <ParsedError {...updateError} />}
    </form>
  );
};

export default UserForm;
