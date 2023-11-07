import { createContext, Dispatch, SetStateAction } from "react";

type ContextProps = {
  autoLayoutEnabled: boolean | null;
  setAutoLayoutEnabled: Dispatch<SetStateAction<boolean | null>>;
  loadedDiagramFromOutside: boolean;
  setLoadedDiagramFromOutside: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<ContextProps>({
  autoLayoutEnabled: true,
  setAutoLayoutEnabled: () => {},
  loadedDiagramFromOutside: false,
  setLoadedDiagramFromOutside: () => {},
});

export { Context };
