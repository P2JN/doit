import { AxiosError } from "axios";
import { Alert, Button, Divider } from "@mui/material";

import { Loader, ParsedError } from "components/atoms";

const DataLoader = (props: {
  isLoading?: boolean;
  hasData?: boolean;
  error?: AxiosError | null;
  retry?: () => void;
  hasNextPage?: boolean;
  loadMore?: () => void;
  topPositioned?: boolean;
}) => {
  return (
    <>
      {props.isLoading && <Loader />}
      {!props.isLoading && !props.hasData && (
        <Alert
          severity="info"
          className="my-3"
          action={
            !!props?.retry && (
              <Button
                color="inherit"
                size="small"
                onClick={() => !!props?.retry && props.retry()}
              >
                Reintentar
              </Button>
            )
          }
        >
          Aún no hay nada aquí
        </Alert>
      )}
      {props.error && <ParsedError {...props.error} />}

      {props.hasNextPage && (
        <>
          {!props.topPositioned && "bottom" && <Divider className="py-4" />}
          <div className="flex w-full justify-center">
            <Button
              color="primary"
              size="large"
              onClick={() => !!props.loadMore && props.loadMore()}
            >
              Cargar más
            </Button>
          </div>
          {props.topPositioned && <Divider className="py-1" />}
        </>
      )}
    </>
  );
};

export default DataLoader;
