import { AxiosError } from "axios";
import { Alert } from "@mui/material";

const handledErrors: { [n: number]: string } = {
  401: "No estas autenticado",
  403: "No tienes permisos para realizar esta acción",
  404: "No hemos encontrado lo que buscabas",
  500: "Algo salió mal en el servidor",
};

const ParsedError = (error: AxiosError) => {
  const isStringError = typeof error.response?.data === "string";
  const isUndefinedError = typeof error.response?.data === "undefined";

  return (
    <Alert severity="error">
      <p>
        <strong>Error,</strong>{" "}
        {error.response?.status
          ? handledErrors[error.response.status] || "Algo salió mal"
          : error.message || "Algo salió mal"}
      </p>

      {!isStringError && !isUndefinedError ? (
        Object.entries(error?.response?.data as any)?.map(([key, value]) => (
          <p key={key}>
            <>
              {key}: {value}
            </>
          </p>
        ))
      ) : (
        <p>Algo salió mal en el servidor</p>
      )}
    </Alert>
  );
};

export { ParsedError };
