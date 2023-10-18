import { useTranslations } from "next-intl";
import { HiSparkles } from "react-icons/hi2";
import { ControlButton, Controls } from "reactflow";
import { colors } from "../../util/colors";
import { useLayoutedElements } from "./hooks/useLayoutedElements";

type ControlPanelProps = {
  onLayoutClick: () => void;
};

export const ControlPanel = ({ onLayoutClick }: ControlPanelProps) => {
  const { layoutElements } = useLayoutedElements();
  const t = useTranslations("home.erDiagram");

  const handleLayoutClick = () => {
    void layoutElements().then(() => {
      setTimeout(onLayoutClick, 100);
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
