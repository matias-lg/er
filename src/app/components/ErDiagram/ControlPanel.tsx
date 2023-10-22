import { useTranslations } from "next-intl";
import { HiSparkles } from "react-icons/hi2";
import { ControlButton, Controls, useReactFlow } from "reactflow";
import { colors } from "../../util/colors";
import { getLayoutedElements } from "./hooks/useLayoutedElements";

type ControlPanelProps = {
  onLayoutClick: () => void;
};

export const ControlPanel = ({ onLayoutClick }: ControlPanelProps) => {
  const t = useTranslations("home.erDiagram");
  const { getNodes, setNodes, getEdges, setEdges, fitView } = useReactFlow();

  const handleLayoutClick = () => {
    const nodes = getNodes();
    const edges = getEdges();
    getLayoutedElements(nodes, edges).then((layoutedNodes) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          const layoutedNode = layoutedNodes.find((n) => n.id === node.id);
          return {
            ...node,
            position: layoutedNode?.position!,
            style: { ...node.style, opacity: 1 },
          };
        }),
      );

      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          hidden: false,
          style: {
            ...edge.style,
          },
        })),
      );
      setTimeout(() => {
        window.requestAnimationFrame(() => fitView());
        onLayoutClick();
      }, 0);
    });
  };

  return (
    <Controls showInteractive={false}>
      <ControlButton
        style={{
          backgroundColor: "#fff",
        }}
        title={t("layoutButton")}
        onClick={handleLayoutClick}
      >
        <HiSparkles
          style={{
            color: colors.textEditorBackground,
          }}
        />
      </ControlButton>
    </Controls>
  );
};
