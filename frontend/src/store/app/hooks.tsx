import { useContext } from "react";

import { Store } from "store/store";

export const useActiveModal = () => {
  const { state, dispatch } = useContext(Store);
  const { activeModal } = state.app;

  const setActiveModal = (activeModal: string) => {
    dispatch({ type: "SET_ACTIVE_MODAL", payload: activeModal });
  };

  return { activeModal, setActiveModal };
};
