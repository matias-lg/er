"use client";
import { useDisclosure } from "@chakra-ui/react";
import { toJpeg, toPng, toSvg } from "html-to-image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MdDownload } from "react-icons/md";
import { getRectOfNodes, useReactFlow } from "reactflow";
import { DownloadFunc, downloadImage, exportToPDF } from "../../util/common";
import { Dropdown } from "./Dropdown";
import { ExportImageModal } from "./ExportModal";
import { useJSON } from "./hooks/useJSON";

const ExportButton = () => {
  const flow = document.querySelector(".react-flow__viewport");
  const flowWidth = flow?.clientWidth;
  const flowHeight = flow?.clientHeight;

  const { getNodes } = useReactFlow();

  const downloadFlow =
    (toImg: typeof toPng, fileExtension: string) =>
    (imageWidth: number, imageHeight: number, transparentBg: boolean) => {
      // we calculate a transform for the nodes so that all nodes are visible
      // we then overwrite the transform of the `.react-flow__viewport` element
      // with the style option of the html-to-image library
      const nodesBounds = getRectOfNodes(getNodes());
      nodesBounds.height += 100;
      nodesBounds.width += 100;
      let toDownload = document.querySelector(".react-flow__renderer")!;
      // @ts-ignore
      toImg(toDownload, {
        backgroundColor: transparentBg ? "transparent" : "white",
        width: imageWidth,
        height: imageHeight,
      }).then((s) => downloadImage(s, fileExtension));
    };

  const t = useTranslations("home.header");
  const { exportToJSON } = useJSON();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exportFunc, setExportFunc] = useState<DownloadFunc>(() => {});
  const [allowTransparent, setAllowTransparent] = useState<boolean>(true);
  const onItemClick = (func: DownloadFunc, allowTransparent: boolean) => {
    setAllowTransparent(allowTransparent);
    setExportFunc(() => func);
    onOpen();
  };

  return (
    <>
      <Dropdown
        title={
          <div className="flex items-center">
            <MdDownload size={25} />{" "}
            <span className="pl-2"> {t("exportDiagram")}</span>
          </div>
        }
        items={[
          [t("asPDF"), () => exportToPDF(1920, 1080).catch(() => {})],
          [t("asSVG"), () => onItemClick(downloadFlow(toSvg, "svg"), true)],
          [t("asJSON"), () => exportToJSON()],
          [t("asPNG"), () => onItemClick(downloadFlow(toPng, "png"), true)],
          [t("asJPEG"), () => onItemClick(downloadFlow(toJpeg, "jpeg"), false)],
        ]}
      />
      <ExportImageModal
        isOpen={isOpen}
        allowTransparent={allowTransparent}
        onButtonClick={exportFunc}
        onClose={onClose}
        defaultWidth={flowWidth || 1920}
        defaultHeight={flowHeight || 1080}
      />
    </>
  );
};

export default ExportButton;
