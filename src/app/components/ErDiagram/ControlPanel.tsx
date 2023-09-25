import { useLayoutedElements } from "./useLayoutedElements";
import { Controls, ControlButton, useReactFlow } from "reactflow";
import { useTranslations } from "next-intl";
import { colors } from "../../util/colors";
import { HiSparkles } from "react-icons/hi2";

export const ControlPanel = () => {
  const { layoutElements } = useLayoutedElements();
  const { fitView } = useReactFlow();
  // const store = useStoreApi();
  const t = useTranslations("home.erDiagram");
  // const [isAutoLayoutEnabled, setIsAutoLayoutEnabled] =
  //   useState<boolean>(false);

  const handleLayoutClick = () => {
    // setIsAutoLayoutEnabled((is) => !is);
    // store.setState({
    //   nodesDraggable: !isAutoLayoutEnabled,
    //   nodesConnectable: !isAutoLayoutEnabled,
    //   elementsSelectable: !isAutoLayoutEnabled,
    // });

    void layoutElements({
      "elk.algorithm": "org.eclipse.elk.force",
      "elk.force.temperature": "0.05",
      "elk.spacing.nodeNode": "4",
      "elk.force.iterations": "1500",
    }).then(() => {
      window.requestAnimationFrame(() => fitView());
    });
  };

  return (
    <Controls showInteractive={false}>
      <ControlButton
        style={{
          // backgroundColor: isAutoLayoutEnabled ? colors.textEditorBackground,
          backgroundColor: "#fff",
        }}
        title={t("layoutButton")}
        onClick={handleLayoutClick}
      >
        <HiSparkles
          style={{
            color: colors.textEditorBackground,
            // color: isAutoLayoutEnabled ? "#fff" : colors.textEditorBackground,
          }}
        />
      </ControlButton>
    </Controls>
  );
};
