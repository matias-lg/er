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
import { Context } from "../../context";
import { useMonaco } from "@monaco-editor/react";
import { useContext } from "react";
import { useTranslations } from "next-intl";
import { LuFilePlus } from "react-icons/lu";

const NewDiagramButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setLoadedDiagramFromOutside } = useContext(Context);
  const monaco = useMonaco();
  const t = useTranslations("home.header.newDiagram");

  const onModalButtonClick = () => {
    // we want to trigger a diagram update event in this case
    setLoadedDiagramFromOutside(false);
    const codeEditorModel = monaco?.editor.getModels()[0];
    codeEditorModel?.setValue("");
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
