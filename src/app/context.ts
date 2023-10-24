import { createContext } from "react";

type ContextProps = {
  autoLayoutEnabled: boolean;
  setAutoLayoutEnabled: (enabled: boolean) => void;
  loadedDiagramFromOutside: boolean;
  setLoadedDiagramFromOutside: (loaded: boolean) => void;
};

const Context = createContext<ContextProps>({
  autoLayoutEnabled: true,
  setAutoLayoutEnabled: () => {},
  loadedDiagramFromOutside: false,
  setLoadedDiagramFromOutside: () => {},
});

export { Context };
