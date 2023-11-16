"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useMonaco } from "@monaco-editor/react";
import { useTranslations } from "next-intl";
import { LuFilePlus } from "react-icons/lu";
import { ErDocChangeEvent } from "../../types/CodeEditor";

type NewDiagramButtonProps = {
  onErDocChange: (evt: ErDocChangeEvent) => void;
};

const NewDiagramButton = ({ onErDocChange }: NewDiagramButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const monaco = useMonaco();
  const t = useTranslations("home.header.newDiagram");

  const onModalButtonClick = () => {
    const codeEditorModel = monaco?.editor.getModels()[0];
    codeEditorModel?.setValue("");
    onErDocChange({
      er: {
        aggregations: [],
        entities: [],
        relationships: [],
      },
      type: "userInput",
    });
    onClose();
  };

  return (
    <>
      <button className="flex items-center" onClick={onOpen}>
        <LuFilePlus size={25} /> <span className="pl-2">{t("title")}</span>
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("modalTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t("modalDescription")}</ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              colorScheme="gray"
              onClick={onModalButtonClick}
            >
              {t("modalConfirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewDiagramButton;
