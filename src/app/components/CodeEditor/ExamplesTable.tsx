import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { List } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EXAMPLES } from "../../util/ErdocExamples";

interface ExamplesTableProps {
  onExampleClick: (newExample: string) => void;
}

const ExamplesTable = ({ onExampleClick }: ExamplesTableProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("home.examples");

  return (
    <div className="mb-4 h-full w-full text-white">
      <button
        className="w-full border-t border-t-slate-50/[0.16] p-2 text-left hover:bg-[#232a34] focus:outline-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">{t("_title")}</span>
          <span>{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
        </div>
      </button>
      {isOpen && (
        <div className="h-full overflow-auto rounded-b-md border-b border-l border-r border-slate-50/[0.16] bg-primary p-2 pb-10">
          <List overflow={"auto"} pb={"5"}>
            {Object.keys(EXAMPLES).map((exampleName) => (
              <Button
                key={exampleName}
                className="mr-1 bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => {
                  onExampleClick(EXAMPLES[exampleName]);
                }}
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
