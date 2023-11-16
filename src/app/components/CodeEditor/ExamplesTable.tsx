import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { List } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErJSON, useJSON } from "../../hooks/useJSON";
import { fetchExample } from "../../util/common";
import { ErDocChangeEvent } from "../../types/CodeEditor";

type ExamplesTableProps = {
  onErDocChange: (evt: ErDocChangeEvent) => void;
};

// TODO: refactor, should request this from server?
const EXAMPLE_NAMES = ["bank", "company", "subclass", "aggregation", "roles"];

const ExamplesTable = ({ onErDocChange }: ExamplesTableProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cachedExample, setCachedExample] = useState<{
    name: string;
    data: ErJSON;
  } | null>(null);

  const { importJSON } = useJSON(onErDocChange);
  const t = useTranslations("home.examples");

  const onExampleClickHandler = (exampleName: string) => {
    if (cachedExample !== null && cachedExample.name === exampleName) {
      importJSON(cachedExample.data);
      return;
    }

    fetchExample(exampleName)
      .then((example) => {
        if (example) {
          setCachedExample({ name: exampleName, data: example });
          importJSON(example);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="mb-4 h-full w-full text-white">
      <button
        className="w-full border-t border-t-slate-50/[0.16] p-2 text-left hover:bg-[#232a34] focus:outline-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">{t("_title")}</span>
          <span>{isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}</span>
        </div>
      </button>
      {isOpen && (
        <div className="h-full overflow-auto rounded-b-md border-b border-l border-r border-slate-50/[0.16] bg-primary p-2 pb-10">
          <List overflow={"auto"} pb={"5"}>
            {EXAMPLE_NAMES.map((exampleName) => (
              <Button
                key={exampleName}
                colorScheme="blue"
                className="mr-1 mt-3 bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => onExampleClickHandler(exampleName)}
              >
                {t(exampleName)}
              </Button>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default ExamplesTable;
