import {
  Box,
  Heading,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Radio,
  Stack,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { NotationTypes } from "../../util/common";
import { NotationPicker } from "./NotationPicker";

type ConfigPanelProps = {
  notationType: NotationTypes;
  setEdgesOrthogonal: (isOrthogonal: boolean) => void;
  onNotationChange: (newNotationType: NotationTypes) => void;
};

export const ConfigPanel = ({
  notationType,
  setEdgesOrthogonal,
  onNotationChange,
}: ConfigPanelProps) => {
  const t = useTranslations("home.erDiagram.configPanel");
  const [isOrthogonal, setIsOrthogonal] = useState<boolean>(false);

  useEffect(() => {
    setEdgesOrthogonal(isOrthogonal);
  }, [isOrthogonal, setEdgesOrthogonal]);

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <IconButton
            className="bg-[#fff]"
            aria-label="erConfig"
            size={"sm"}
            icon={<AiFillSetting size={23} />}
            title={t("title")}
          />
        </PopoverTrigger>
        <PopoverContent maxW={"max-content"}>
          <PopoverCloseButton />
          <PopoverBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <NotationPicker
                  initialNotation={notationType}
                  onNotationChange={(newNotation) => {
                    onNotationChange(newNotation);
                    if (newNotation !== "arrow") {
                      setEdgesOrthogonal(false);
                      setIsOrthogonal(false);
                    }
                  }}
                />
              </Box>

              <Box>
                <Heading size="xs" pb={2}>
                  {t("edgeRouting")}
                </Heading>

                <Stack direction="column">
                  <Radio
                    colorScheme="gray"
                    isChecked={!isOrthogonal}
                    onChange={() => setIsOrthogonal(false)}
                  >
                    {t("straight")}
                  </Radio>

                  <Radio
                    colorScheme="gray"
                    isChecked={isOrthogonal}
                    onChange={() => setIsOrthogonal(true)}
                    isDisabled={notationType !== "arrow"}
                  >
                    <Tooltip
                      label={
                        notationType !== "arrow"
                          ? t("orthogonalDisabled")
                          : undefined
                      }
                    >
                      {t("orthogonal")}
                    </Tooltip>
                  </Radio>
                </Stack>
              </Box>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
