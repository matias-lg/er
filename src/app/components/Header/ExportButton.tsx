"use client";
import { DownloadIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { toJpeg, toPng, toSvg } from "html-to-image";
import { useState } from "react";
import { getRectOfNodes, useReactFlow } from "reactflow";
import { DownloadFunc, downloadImage, exportToPDF } from "../../util/common";
import { Dropdown } from "./Dropdown";
import { ExportImageModal } from "./ExportModal";
import { useTranslations } from "next-intl";

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exportFunc, setExportFunc] = useState<DownloadFunc>(() => {});
  const onItemClick = (func: DownloadFunc) => {
    setExportFunc(() => func);
    onOpen();
  };

  return (
    <>
      <Dropdown
        title={
          <>
            <DownloadIcon /> {t("exportDiagram")}
          </>
        }
        items={[
          [t("asPDF"), () => exportToPDF(1920, 1080).catch(() => {})],
          [t("asPNG"), () => onItemClick(downloadFlow(toPng, "png"))],
          [t("asSVG"), () => onItemClick(downloadFlow(toSvg, "svg"))],
          [t("asJPEG"), () => onItemClick(downloadFlow(toJpeg, "jpeg"))],
        ]}
      />
      <ExportImageModal
        isOpen={isOpen}
        onButtonClick={exportFunc}
        onClose={onClose}
        defaultWidth={flowWidth || 1920}
        defaultHeight={flowHeight || 1080}
      />
    </>
  );
};

export default ExportButton;
