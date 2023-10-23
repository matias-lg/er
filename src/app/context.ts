import { createContext } from "react";

type ContextProps = {
  autoLayoutEnabled: boolean;
  setAutoLayoutEnabled: (enabled: boolean) => void;
};

const Context = createContext<ContextProps>({
  autoLayoutEnabled: true,
  setAutoLayoutEnabled: () => {},
});

export { Context };
