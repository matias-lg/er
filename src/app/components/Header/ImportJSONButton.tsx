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
import { MdUpload } from "react-icons/md";
import { useReactFlow } from "reactflow";

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
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: read erdoc, parse, read nodes and edges, set positions of existing nodes and edges
  const todo = () => {};

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
            <Button variant="outline" colorScheme="gray" onClick={() => todo()}>
              {modalConfirm}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportJSONButton;
