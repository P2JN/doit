import { useQuery } from "react-query";

import { SocialTypes } from "types";

import { axiosInstance } from "./config";

const requests = {
  getUsers: (filters?: string[]) =>
    axiosInstance
      .get("/user/" + (!!filters ? "?" + filters?.join("&") : ""))
      .then((response) => response.data),
  getUser: (id?: number) =>
    axiosInstance
      .get("/user/" + (id || "missing"))
      .then((response) => response.data),
};

const goalService = {
  // USERS

  // Use all the users
  useUsers: () =>
    useQuery<SocialTypes.User[], Error>("users", () => requests.getUsers()),

  // Use an user specifying its id
  useUser: (id?: number) =>
    useQuery<SocialTypes.User, Error>(`user-${id}`, () => requests.getUser(id)),
};

export default goalService;
