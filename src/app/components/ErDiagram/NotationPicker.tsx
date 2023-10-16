import { Box, Heading, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { NotationTypes } from "../../util/common";

type NotationPickerProps = {
  onNotationChange: (newNotation: NotationTypes) => void;
  initialNotation: NotationTypes;
  className?: string;
};

export const NotationPicker = ({
  initialNotation,
  onNotationChange,
}: NotationPickerProps) => {
  const t = useTranslations("home.erDiagram");

  return (
    <Box>
      <Heading size="xs" pb={2}>
        {t("notationButton")}
      </Heading>

      <RadioGroup
        defaultValue={initialNotation}
        onChange={(v: NotationTypes) => onNotationChange(v)}
      >
        <Stack direction="column">
          <Radio colorScheme="gray" value="arrow">
            {t("arrowNotation")}
          </Radio>

          <Radio colorScheme="gray" value="minmax">
            {t("minMaxNotation")}
          </Radio>

          <Radio colorScheme="gray" value="chen">
            {t("chenNotation")}
          </Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};
