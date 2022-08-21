import { ReactNode, useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import { AxiosError } from "axios";

import { axiosInstance } from "services/config";

import { ParsedError } from "components/atoms";

const HIDE_TIME = 2500;

const ErrorHandler = (props: { children: ReactNode }) => {
  const [interceptorAdded, setInterceptorAdded] = useState(false);

  const [error, setError] = useState<any>(null);
  const [errorId, setErrorId] = useState<number>(0);

  const isNotInternalAcceptedError = (error: AxiosError) => {
    return (
      typeof error.response?.data !== "string" ||
      (!error.response.data.includes("missing") &&
        !error.response.data.includes("TemplateDoesNotExist") &&
        !error.response.data.includes("api/assistant"))
    );
  };

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (
          error.response &&
          error.response.status !== 401 &&
          isNotInternalAcceptedError(error)
        ) {
          setError(error);
          setErrorId(errorId + 1);
        }
        return Promise.reject(error);
      }
    );

    setInterceptorAdded(true);
  }, [errorId]);

  return (
    <>
      {error && (
        <Snackbar
          autoHideDuration={HIDE_TIME}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          key={errorId}
          onClose={() => {
            setError(null);
          }}
          open={!!error}
        >
          <div>
            <ParsedError {...error} />
          </div>
        </Snackbar>
      )}
      {interceptorAdded && props.children}
    </>
  );
};

export default ErrorHandler;
