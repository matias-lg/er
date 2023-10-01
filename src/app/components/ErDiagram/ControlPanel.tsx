import { useLayoutedElements } from "./useLayoutedElements";
import { Controls, ControlButton, useReactFlow } from "reactflow";
import { useTranslations } from "next-intl";
import { colors } from "../../util/colors";
import { HiSparkles } from "react-icons/hi2";

export const ControlPanel = () => {
  const { layoutElements } = useLayoutedElements();
  const { fitView } = useReactFlow();
  const t = useTranslations("home.erDiagram");

  const handleLayoutClick = () => {
    void layoutElements().then(() => {
      window.requestAnimationFrame(() => fitView());
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
