import {
  Box,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DownloadFunc } from "../../util/common";

export const ExportImageModal = ({
  isOpen,
  onClose,
  defaultWidth,
  defaultHeight,
  onButtonClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: DownloadFunc;
  defaultWidth: number;
  defaultHeight: number;
}) => {
  const t = useTranslations("home.exportModal");
  const [width, setWidth] = useState<number>(defaultWidth);
  const [height, setHeight] = useState<number>(defaultHeight);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            {t("imageWidth")}
            <NumberInput
              onChange={(value) => setWidth(parseInt(value))}
              w={"50%"}
              defaultValue={defaultWidth}
              min={500}
              max={2560}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box pt={2}>
            {t("imageHeight")}
            <NumberInput
              onChange={(value) => setHeight(parseInt(value))}
              w={"50%"}
              defaultValue={defaultHeight}
              min={500}
              max={1440}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box pt={2}>
            <Checkbox
              onChange={() => {
                setTransparentBg((t) => !t);
              }}
            >
              {t("transparent")}
            </Checkbox>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={() => onButtonClick(width, height, transparentBg)}
          >
            {t("export")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
