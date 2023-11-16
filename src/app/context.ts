import { createContext, Dispatch, SetStateAction } from "react";

type ContextProps = {
  autoLayoutEnabled: boolean | null;
  setAutoLayoutEnabled: Dispatch<SetStateAction<boolean | null>>;
};

const Context = createContext<ContextProps>({
  autoLayoutEnabled: true,
  setAutoLayoutEnabled: () => {},
});

export { Context };
