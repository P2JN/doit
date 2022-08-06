import { useContext } from "react";

import { Store } from "store/store";
import { SocialTypes } from "types";

export const useActiveModal = () => {
  const { state, dispatch } = useContext(Store);
  const { activeModal } = state.app;

  const setActiveModal = (activeModal: string) => {
    dispatch({ type: "SET_ACTIVE_MODAL", payload: activeModal });
  };

  return { activeModal, setActiveModal };
};

export const useActiveUser = () => {
  const { state, dispatch } = useContext(Store);
  const { activeUser } = state.app;

  const setActiveUser = (activeUser?: SocialTypes.User) => {
    dispatch({ type: "SET_ACTIVE_USER", payload: activeUser });
  };

  return { activeUser, setActiveUser };
};

export const useAlertCount = () => {
  const { state, dispatch } = useContext(Store);
  const { alertCount } = state.app;

  const setAlertCount = (alertCount: number) => {
    dispatch({ type: "SET_ALERT_COUNT", payload: alertCount });
  };

  return { alertCount, setAlertCount };
};
