"use client";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { MdInfoOutline } from "react-icons/md";

const AboutButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations("home.header.about");

  return (
    <>
      <button className="flex items-center" onClick={onOpen}>
        <MdInfoOutline size={25} />
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <span>{t("developedBy")} </span>
            <a
              href="https://github.com/matias-lg/"
              target="_blank"
              className="text-blue-500 underline"
            >
              Matías López
            </a>
            <span> {t("during")} </span>
            <a>Universidad de Chile.</a>
            <br />
            <span>{t("license")}</span>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutButton;
