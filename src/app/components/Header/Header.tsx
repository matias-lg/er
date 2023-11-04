import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { BiSolidBook } from "react-icons/bi";
import { MdDownload } from "react-icons/md";
import AutoLayoutSwitch from "./AutoLayoutSwitch";
import SaveLoadFileButton from "./SaveLoadFileButton";

const PROJECT_GITHUB = "https://github.com/matias-lg/er";

const HeaderElement = ({
  children,
  className = "",
}: {
  children: JSX.Element;
  className: string;
}) => (
  <div
    className={
      "mx-0 flex items-center border-border px-4 py-2   text-center tracking-wide text-slate-200 " +
      className
    }
  >
    {children}
  </div>
);

export const Header = () => {
  const t = useTranslations("home.header");
  const DynamicExportButton = useMemo(
    () =>
      dynamic(() => import("./ExportButton"), {
        ssr: false,
        loading: () => (
          <div className="flex items-center">
            <MdDownload size={25} />{" "}
            <span className="pl-2"> {t("exportDiagram")}</span>
          </div>
        ),
      }),
    [],
  );

  return (
    <>
      <div className="flex h-full w-[65%]  items-center pl-6  text-slate-200">
        ERdoc Playground
      </div>
      <div className=" flex h-full w-[90%] items-center pl-2 text-slate-200">
        <HeaderElement className="border-l-[1px]">
          <>
            <AutoLayoutSwitch title={t("autoLayout")} />
          </>
        </HeaderElement>

        <HeaderElement className="border-l-[1px]">
          <SaveLoadFileButton
            title={t("import")}
            modalTitle={t("importModal.title")}
            modalDescription={t("importModal.description")}
            modalConfirm={t("importModal.upload")}
          />
        </HeaderElement>

        <HeaderElement className="cursor-pointer border-l-[1px] border-r-[1px]">
          <DynamicExportButton />
        </HeaderElement>
        <HeaderElement className="border-r-[1px]">
          <a className="flex items-center" href="/docs" target="_blank">
            <BiSolidBook /> <span className="pl-2">{t("documentation")}</span>
          </a>
        </HeaderElement>
      </div>
      <div className=" flex h-full items-center pl-2 text-slate-200">
        <GitHubButton />
      </div>
    </>
  );
};

const GitHubButton = () => {
  return (
    <a
      className="ml-6 block pr-6 text-slate-400  hover:text-slate-300"
      href={PROJECT_GITHUB}
      target="_blank"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-5 w-5 cursor-pointer"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </a>
  );
};

export default Header;
