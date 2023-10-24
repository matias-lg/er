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
import { ChangeEventHandler, useRef } from "react";
import { MdUpload } from "react-icons/md";
import { useJSON } from "./hooks/useJSON";

const validate = (json: any): boolean => {
  if (!json.erDoc) return false;
  if (!json.nodes) return false;
  if (!json.edges) return false;
  if (!Array.isArray(json.nodes)) return false;
  if (!Array.isArray(json.edges)) return false;
  if (
    !json.nodes.every((node: any) => {
      return (
        node.id &&
        node.position &&
        node.position.x !== undefined &&
        node.position.y !== undefined
      );
    })
  )
    return false;
  if (!json.edges.every((node: any) => node.id && node.source && node.target))
    return false;

  return true;
};

const ImportJSONButton = ({
  title,
  modalTitle,
  modalDescription,
  modalConfirm,
}: {
  title: string;
  modalTitle: string;
  modalDescription: string;
  modalConfirm: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { importJSON } = useJSON();

  let fileRef = useRef<HTMLInputElement | null>(null);

  const readFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileReader = new FileReader();
    const { files } = event.target;
    if (!files?.length) {
      return;
    }
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      if (e.target === null) return;
      const content = e.target.result;
      const json = JSON.parse(content as string);
      const isValid = validate(json);
      if (!isValid) {
        alert("Invalid JSON");
        return;
      }
      importJSON(json);
      onClose();
    };
  };

  return (
    <>
      <button className="flex items-center" onClick={onOpen}>
        <MdUpload size={25} /> <span className="pl-2">{title}</span>
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalDescription}</ModalBody>
          <ModalFooter>
            <input
              className="hidden"
              ref={fileRef}
              type="file"
              onChange={readFile}
            />
            <Button
              variant="outline"
              colorScheme="gray"
              onClick={() => fileRef.current?.click()}
            >
              {modalConfirm}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportJSONButton;
