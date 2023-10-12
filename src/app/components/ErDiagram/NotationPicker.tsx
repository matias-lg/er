import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Notations = "minmax" | "arrow";

type NotationPickerProps = {
  onNotationChange: (newNotation: Notations) => void;
  initialNotation: Notations;
  className?: string;
};

export const NotationPicker = ({
  initialNotation: initialNotationType,
  onNotationChange,
}: NotationPickerProps) => {
  const t = useTranslations("home.erDiagram");
  const [selectedNotationType, setSelectedNotationType] =
    useState<Notations>(initialNotationType);

  const handleNotationClick = (notation: Notations) => {
    onNotationChange(notation);
    setSelectedNotationType(notation);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        border={"1px solid #eee"}
        className="bg-[#fff]"
        shadow={"sm"}
      >
        {t("notationButton")}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleNotationClick("arrow")}>
          <span>{t("arrowNotation")}</span>
          {selectedNotationType === "arrow" && <CheckIcon marginLeft={"auto"} />}
        </MenuItem>
        <MenuItem onClick={() => handleNotationClick("minmax")}>
          <span>{t("minMaxNotation")}</span>
          {selectedNotationType === "minmax" && <CheckIcon marginLeft={"auto"} />}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
