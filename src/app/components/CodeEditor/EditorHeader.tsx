import { Box, IconButton } from "@chakra-ui/react";
import { editor } from "monaco-types";
import { MutableRefObject, ReactElement, useState } from "react";
import { colors } from "../../util/colors";
import { BiSolidCopyAlt } from "react-icons/bi";
import { FaRedo, FaUndo } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";
import { useTranslations } from "next-intl";

export const EditorHeader = ({
  editorRef,
}: {
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>;
}) => {
  const t = useTranslations("home.codeEditor.editorHeader");

  return (
    <Box
      height={"3.6%"}
      bg={colors.textEditorBackground}
      borderBottom={"1px"}
      borderBottomColor={"rgb(248 250 252 / 0.16)"}
      className=" flex h-[26px] w-full flex-row items-center justify-end"
    >
      <div className="flex">
        <EditorButton
          icon={<BiSolidCopyAlt fill="#fff" />}
          label={t("copy")}
          useClickedAnimation={true}
          onClick={() => {
            const content = editorRef.current?.getValue();
            if (content) void navigator.clipboard.writeText(content);
          }}
        />

        <EditorButton
          icon={<FaUndo fill="#fff" />}
          label={t("undo")}
          onClick={() => editorRef.current?.trigger("undoButton", "undo", null)}
        />

        <EditorButton
          icon={<FaRedo fill="#fff" />}
          label={t("redo")}
          onClick={() => editorRef.current?.trigger("undoButton", "redo", null)}
        />
      </div>
    </Box>
  );
};

const EditorButton = ({
  icon,
  onClick,
  label,
  useClickedAnimation = false,
}: {
  useClickedAnimation?: boolean;
  icon: ReactElement;
  onClick: () => void;
  label: string;
}) => {
  const [clicked, setClicked] = useState(false);
  const onClickHandler = () => {
    onClick();
    if (useClickedAnimation) {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    }
  };

  return (
    <IconButton
      borderRadius={"2xl"}
      bg={colors.textEditorBackground}
      _hover={{ bg: "#2e3136" }}
      _active={{ bg: "#3f4651", borderWidth: "1px", borderColor: "green" }}
      style={{
        borderWidth: clicked ? "1px" : "0px",
        borderColor: clicked ? "green" : "transparent",
      }}
      h={"25px"}
      aria-label={label}
      title={label}
      icon={clicked ? <AiOutlineCheck fill={"#4ade80"} /> : icon}
      onClick={onClickHandler}
    />
  );
};
