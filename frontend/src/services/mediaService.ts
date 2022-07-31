import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { axiosInstance } from "./config";

const requests = {
  // receives a multipart form data
  uploadMedia: (formData: FormData) =>
    axiosInstance
      .post("/media/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data),
};

const mediaService = {
  useUploadMedia: () =>
    useMutation<any, AxiosError, FormData>(requests.uploadMedia),
};

export default mediaService;
