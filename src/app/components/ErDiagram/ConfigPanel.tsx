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
  RadioGroup,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
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
                  onNotationChange={(newNotation) =>
                    onNotationChange(newNotation)
                  }
                />
              </Box>

              <Box>
                <Heading size="xs" pb={2}>
                  {t("edgeRouting")}
                </Heading>

                <RadioGroup
                  defaultValue="1"
                  onChange={(v) => setEdgesOrthogonal(v === "2")}
                >
                  <Stack direction="column">
                    <Radio colorScheme="gray" value="1">
                      {t("straight")}
                    </Radio>
                    <Radio colorScheme="gray" value="2">
                      {t("orthogonal")}
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
