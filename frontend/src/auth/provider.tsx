import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { socialService } from "services";
import { axiosInstance } from "services/config";
import { useActiveUser } from "store";

const ActiveUserProvider = (props: { children: ReactNode }) => {
  const { setActiveUser } = useActiveUser();

  // Load active user data
  const [userLoaded, setUserLoaded] = useState(false);

  const { data: user, isLoading, isError } = socialService.useActiveUser();

  useEffect(() => {
    if (isError) setActiveUser(undefined);
    else setActiveUser(user?.mongoUser);
    if (isError || user?.mongoUser) setUserLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isError]);

  return <>{!isLoading && userLoaded && props.children}</>;
};

const AuthProvider = (props: { children: ReactNode }) => {
  const navigate = useNavigate();

  // Add session interceptors
  const [interceptorAdded, setInterceptorAdded] = useState(false);
  const [tokenUpdated, setTokenUpdated] = useState(true);

  useEffect(() => {
    setInterceptorAdded(false);

    axiosInstance.interceptors.response.use((response) => {
      const currentToken = localStorage.getItem("token");

      if (response.data.key) {
        setTokenUpdated(false);
        localStorage.setItem("token", response.data.key);
        setTokenUpdated(true);
      }

      // handle expired token
      if (currentToken && response.status === 401) {
        setTokenUpdated(false);
        localStorage.removeItem("token");
        navigate("/auth/login");
        setTokenUpdated(true);
      }

      return response;
    });

    axiosInstance.interceptors.request.use((config) => {
      if (config.headers) {
        delete config.headers.Authorization;

        const currentToken = localStorage.getItem("token");
        if (currentToken) {
          config.headers.Authorization = `Token ${currentToken}`;
        }
      }

      return config;
    });

    setInterceptorAdded(true);
  }, [navigate]);

  return (
    <>
      {interceptorAdded && tokenUpdated && (
        <ActiveUserProvider key={localStorage.getItem("token")}>
          {props.children}
        </ActiveUserProvider>
      )}
    </>
  );
};

export default AuthProvider;
