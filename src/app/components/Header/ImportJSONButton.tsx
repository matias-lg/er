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
import { ChangeEventHandler, useRef, useState } from "react";
import { MdUpload } from "react-icons/md";
import { useReactFlow } from "reactflow";
import { useJSON, ValidJSON } from "./hooks/useJSON";

const validate = (json: any): boolean => {
  console.log("validating", json);
  if (!json.erDoc) return false;
  console.log("has erdoc");
  if (!json.nodes) return false;
  console.log("has nodes");
  if (!json.edges) return false;
  console.log("has edges");
  if (!Array.isArray(json.nodes)) return false;
  console.log("nodes is array");
  if (!Array.isArray(json.edges)) return false;
  console.log("edges is array");
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
  console.log("nodes are valid");
  if (!json.edges.every((node: any) => node.id && node.source && node.target))
    return false;
  console.log("edges are valid");

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

  // TODO: read erdoc, parse, read nodes and edges, set positions of existing nodes and edges
  const onClickHandler = () => {};

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
