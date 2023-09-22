import { useState } from "react";
import { useLayoutedElements } from "./useLayoutedElements";
import { Controls, ControlButton, useReactFlow, useStoreApi } from "reactflow";
import { useTranslations } from "next-intl";
import { colors } from "../../util/colors";
import { HiSparkles } from "react-icons/hi2";

export const ControlPanel = () => {
  const { layoutElements } = useLayoutedElements();
  const { fitView } = useReactFlow();
  const store = useStoreApi();
  const t = useTranslations("home.erDiagram");
  const [isAutoLayoutEnabled, setIsAutoLayoutEnabled] =
    useState<boolean>(false);

  const handleLayoutClick = () => {
    setIsAutoLayoutEnabled((is) => !is);
    store.setState({
      nodesDraggable: !isAutoLayoutEnabled,
      nodesConnectable: !isAutoLayoutEnabled,
      elementsSelectable: !isAutoLayoutEnabled,
    });

    void layoutElements({
      "elk.algorithm": "org.eclipse.elk.stress",
      "elk.stress.desiredEdgeLength": "130",
    }).then(() => {
      window.requestAnimationFrame(() => fitView());
    });
  };

  return (
    <Controls showInteractive={false}>
      <ControlButton
        style={{
          backgroundColor: isAutoLayoutEnabled
            ? colors.textEditorBackground
            : "#fff",
        }}
        title={t("layoutButton")}
        onClick={handleLayoutClick}
      >
        <HiSparkles
          style={{
            color: isAutoLayoutEnabled ? "#fff" : colors.textEditorBackground,
          }}
        />
      </ControlButton>
    </Controls>
  );
};
