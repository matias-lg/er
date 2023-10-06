import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ArrowNotation from "./notations/ArrowNotation/ArrowNotation";
import ErNotation from "./notations/DefaultNotation";
import MinMaxNotation from "./notations/MinMaxNotation/MinMaxNotation";

type NotationPickerProps = {
  onNotationChange: (newNotation: ErNotation) => void;
  initialNotation: ErNotation;
  className?: string;
};

const notationMetadata = [
  {
    notation: new ArrowNotation(),
    textKey: "arrowNotation",
  },
  {
    notation: new MinMaxNotation(),
    textKey: "minMaxNotation",
  },
];

export const NotationPicker = ({
  initialNotation,
  onNotationChange,
}: NotationPickerProps) => {
  const t = useTranslations("home.erDiagram");
  const [selectedNotation, setSelectedNotation] = useState<string>(
    initialNotation.type,
  );

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
        {notationMetadata.map(({ notation, textKey }) => (
          <MenuItem
            key={notation.type}
            onClick={() => {
              onNotationChange(notation);
              setSelectedNotation(notation.type);
            }}
          >
            <span>{t(textKey)}</span>
            {selectedNotation === notation.type && (
              <CheckIcon marginLeft={"auto"} />
            )}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
