import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { List } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EXAMPLE_NAMES } from "../../util/ErdocExamples";

interface ExamplesTableProps {
  onExampleClick: (newExample: string) => void;
}

const ExamplesTable = ({ onExampleClick }: ExamplesTableProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("home.examples");

  const fetchExample = async (exampleName: string) => {
    const res = await fetch(`/api/examples/${exampleName}`);
    // if res is 404, then the example doesn't exist
    if (res.status === 404) {
      return null;
    } else {
      const data: { example: string } = await (res.json() as Promise<{
        example: string;
      }>);
      return data.example;
    }
  };

  const onExampleClickHandler = (exampleName: string) => {
    const exampleKey = `example ${exampleName}`;
    const storedExample = localStorage.getItem(exampleKey);
    if (storedExample !== null) {
      onExampleClick(storedExample);
      return;
    }
    fetchExample(exampleName)
      .then((example) => {
        if (example) {
          localStorage.setItem(`example ${exampleName}`, example);
          onExampleClick(example);
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
          <span>{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
        </div>
      </button>
      {isOpen && (
        <div className="h-full overflow-auto rounded-b-md border-b border-l border-r border-slate-50/[0.16] bg-primary p-2 pb-10">
          <List overflow={"auto"} pb={"5"}>
            {EXAMPLE_NAMES.map((exampleName) => (
              <Button
                key={exampleName}
                className="mr-1 bg-blue-500 text-white hover:bg-blue-600"
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
