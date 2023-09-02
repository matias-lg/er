import { useState } from "react";
import { ErrorMessage } from "../../types/ErrorMessage";
import { useTranslations } from "use-intl";
import { List, ListItem } from "@chakra-ui/layout";

interface ErrorTableProps {
  errors: ErrorMessage[];
}

const ErrorTable = ({ errors }: ErrorTableProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("home.errorsTable");

  return (
    <div className="h-full w-full text-white mb-4">
      <button
        className="w-full p-2 text-left border-t border-t-slate-50/[0.16] hover:bg-[#21252b/0.96] focus:outline-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {t("errors")} {errors.length > 0 && ` (${errors.length})`}
          </span>
          <span
            className={`transform ${
              isOpen ? "rotate-180" : "rotate-0"
            } transition-transform`}
          ></span>
        </div>
      </button>
      {isOpen && (
        <div className="h-full overflow-auto p-2 pb-10 border-l border-r border-b border-slate-50/[0.16] rounded-b-md bg-[#21252b]">
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
