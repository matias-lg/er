"use client";
import { DownloadIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { toJpeg, toPng, toSvg } from "html-to-image";
import { useState } from "react";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { DownloadFunc, downloadImage } from "../../util/common";
import { Dropdown } from "./Dropdown";
import { ExportImageModal } from "./ExportModal";
import { useTranslations } from "next-intl";

const ExportButton = () => {
  const dummy = () => {
    console.log("dummy");
  };

  // lets get the window size
  const flow = document.querySelector(".react-flow__viewport");
  // lets get the dimensions of ele
  const flowWidth = flow?.clientWidth;
  const flowHeight = flow?.clientHeight;

  const { getNodes } = useReactFlow();
  const downloadFlow =
    (toImg: typeof toPng) =>
    (imageWidth: number, imageHeight: number, transparentBg: boolean) => {
      // we calculate a transform for the nodes so that all nodes are visible
      // we then overwrite the transform of the `.react-flow__viewport` element
      // with the style option of the html-to-image library
      const nodesBounds = getRectOfNodes(getNodes());
      const transform = getTransformForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
      );
      let toDownload = document.querySelector(".react-flow__renderer")!;

      // @ts-ignore
      toImg(toDownload, {
        backgroundColor: transparentBg ? "transparent" : "white",
        width: imageWidth,
        height: imageHeight,
        style: {
          width: imageWidth,
          height: imageHeight,
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
      }).then(downloadImage);
    };

  const t = useTranslations("home.header");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exportFunc, setExportFunc] = useState<DownloadFunc>(dummy);
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
          [t("asPDF"), dummy],
          [t("asPNG"), () => onItemClick(downloadFlow(toPng))],
          [t("asSVG"), () => onItemClick(downloadFlow(toSvg))],
          [t("asJPEG"), () => onItemClick(downloadFlow(toJpeg))],
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
