import { AxiosError } from "axios";
import { Alert } from "@mui/material";

const ParsedError = (error: AxiosError) => {
  return (
    <Alert severity="error">
      <p>
        <strong>Error,</strong> {error?.message || "algo ha sucedido"}
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
