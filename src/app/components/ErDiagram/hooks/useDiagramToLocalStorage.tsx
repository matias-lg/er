import { useCallback, useContext, useState } from "react";
import { ReactFlowInstance, useReactFlow } from "reactflow";
import { Context } from "../../../context";

const LOCAL_STORAGE_FLOW_KEY = "er-flow";

export const useDiagramToLocalStorage = () => {
  const { setNodes, setEdges, setViewport } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const saveToLocalStorage = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(LOCAL_STORAGE_FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const { setLoadedDiagramFromOutside } = useContext(Context);

  const loadFromLocalStorage = () => {
    const storedFlow = localStorage.getItem(LOCAL_STORAGE_FLOW_KEY);
    if (storedFlow) {
      const flow = JSON.parse(storedFlow);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setLoadedDiagramFromOutside(true);
      setNodes(() => {
        return flow.nodes || [];
      });
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
      return true;
    }
    return false;
  };

  return { saveToLocalStorage, loadFromLocalStorage, setRfInstance };
};
