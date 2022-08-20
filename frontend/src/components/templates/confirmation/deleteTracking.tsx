import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { goalService } from "services";
import { useNotificationStore } from "store";

const DeleteTrackingConfirmation = () => {
  const navigate = useNavigate();
  const { trackingId } = useParams();
  const { addNotification } = useNotificationStore();
  const { mutate: removeTracking } = goalService.useRemoveTracking();

  const onRemoveTracking = () => {
    if (trackingId)
      removeTracking(trackingId, {
        onSuccess: () => {
          addNotification({
            title: "Se ha eliminado el registro",
            content: "Dejará de contar el progreso en este objetivo.",
            type: "transient",
          });
          navigate(-1);
        },
      });
  };

  return (
    <>
      <p>¿Estás seguro de que quieres eliminar este progreso?</p>
      <div className="mt-4 flex w-full">
        <Button
          color="error"
          className="!ml-auto"
          variant="outlined"
          size="large"
          onClick={onRemoveTracking}
        >
          Eliminar
        </Button>
      </div>
    </>
  );
};

export default DeleteTrackingConfirmation;
