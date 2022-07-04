import { ReactNode, useReducer } from "react";

import { initialState, Store } from "store/store";
import { Reducer } from "store/reducer";

const StoreProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Store.Provider value={{ state: state || initialState, dispatch }}>
      {props.children}
    </Store.Provider>
  );
};

export default StoreProvider;
