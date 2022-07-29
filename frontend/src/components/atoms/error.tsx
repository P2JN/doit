import { AxiosError } from "axios";
import { Alert } from "@mui/material";

const handledErrors: { [n: number]: string } = {
  401: "No tienes permisos para realizar esta acción",
  404: "No hemos encontrado lo que buscabas",
  500: "Ha ocurrido un error en el servidor",
};

const ParsedError = (error: AxiosError) => {
  return (
    <Alert severity="error">
      <p>
        <strong>Error,</strong>{" "}
        {error.response?.status
          ? handledErrors[error.response.status]
          : error.message}
      </p>

      {Object.entries(error?.response?.data as any)?.map(([key, value]) => (
        <p key={key}>
          <>
            {key}: {value}
          </>
        </p>
      ))}
    </Alert>
  );
};

export { ParsedError };
