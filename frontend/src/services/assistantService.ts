import { AxiosError } from "axios";
import { useQuery } from "react-query";

import { axiosInstance } from "./config";

const requests = {
  getAssistantMessage: (view?: string) =>
    axiosInstance.get("/assistant" + view).then((response) => response.data),
};

const assistantService = {
  useAssistantMessage: (view?: string) =>
    useQuery<{ message: string }, AxiosError>(
      ["assistant", view],
      () => requests.getAssistantMessage(view),
      {
        cacheTime: 0,
      }
    ),
};

export default assistantService;
