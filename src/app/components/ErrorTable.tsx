import { useState } from "react";
import { ErrorMessage } from "../types/ErrorMessage";
import { useTranslations } from "use-intl";
import { List, ListItem } from "@chakra-ui/layout";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface ErrorTableProps {
  errors: ErrorMessage[];
}

const ErrorTable = ({ errors }: ErrorTableProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("home.errorsTable");

  return (
    <div className="mb-4 h-full w-full text-white">
      <button
        className="w-full border-t border-t-slate-50/[0.16] p-2 text-left hover:bg-[#232a34] focus:outline-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {t("errors")} {errors.length > 0 && ` (${errors.length})`}
          </span>
          <span>{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
        </div>
      </button>
      {isOpen && (
        <div className="h-full overflow-auto rounded-b-md border-b border-l border-r border-slate-50/[0.16] bg-[#21252b] p-2 pb-10">
          <List overflow={"auto"} pb={"5"}>
            {errors.map((err) => (
              <ListItem>
                {"- "}
                {err.errorMessage}
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default ErrorTable;
