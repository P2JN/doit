import { useState } from "react";
import { FormLabel, IconButton } from "@mui/material";
import { Delete, PhotoCamera } from "@mui/icons-material";

import { mediaService } from "services";
import { Id } from "types/apiTypes";

import { Loader, ParsedError } from "components/atoms";

const LogInForm = (props: { onUploadFinished: (mediaId?: Id) => void }) => {
  const {
    mutate: uploadImage,
    isLoading,
    isError,
    error,
  } = mediaService.useUploadMedia();

  const [lastUploaded, setLastUploaded] = useState<Id | undefined>(undefined);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // will send a request with a multipart form file
    const file = e.target.files?.[0];
    const fileName = file?.name;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadImage(formData, {
        onSuccess: (response) => {
          setLastUploaded(fileName);
          props.onUploadFinished(response);
        },
      });
    }
  };

  const onImageRemove = () => {
    setLastUploaded(undefined);
    props.onUploadFinished(undefined);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <FormLabel className="mb-2">Imagen</FormLabel>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input hidden accept="image/*" type="file" onChange={onImageUpload} />
          <PhotoCamera />
        </IconButton>
      </div>
      {lastUploaded && (
        <div className="flex w-full items-center justify-end text-xs">
          {lastUploaded}{" "}
          <IconButton
            color="primary"
            aria-label="delete picture"
            component="label"
            onClick={onImageRemove}
          >
            <Delete />
          </IconButton>
        </div>
      )}
      {isLoading && <Loader />}
      {isError && <ParsedError {...error} />}
    </div>
  );
};

export default LogInForm;
