"use client";
import { useState } from "react";
import Body from "../components/Body";
import Header from "../components/Header/Header";
import { Context } from "../context";
import { erDocWithoutLocation } from "../util/common";
import { ErDocChangeEvent } from "../types/CodeEditor";
import { ER } from "../../ERDoc/types/parser/ER";

const Page = () => {
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState<boolean | null>(
    null,
  );
  const [loadedDiagramFromOutside, setLoadedDiagramFromOutside] =
    useState<boolean>(false);

  const [erDoc, setErDoc] = useState<ER | null>(null);

  const onErDocChange = (evt: ErDocChangeEvent) => {
    switch (evt.type) {
      case "json": {
        return;
      }

      case "localStorage": {
        return;
      }

      case "userInput": {
        const { er } = evt;
        setErDoc((currentEr) => {
          if (currentEr === null) return er;
          const currentErNoLoc = erDocWithoutLocation(currentEr);
          const newErNoLoc = erDocWithoutLocation(er);
          const sameSemanticValue =
            JSON.stringify(currentErNoLoc) === JSON.stringify(newErNoLoc);
          return sameSemanticValue ? currentEr : er;
        });
        return;
      }

      default: {
        const exhaustiveCheck: never = evt;
        throw new Error(`Unhandled event type: ${exhaustiveCheck}`);
      }
    }
  };

  return (
    <Context.Provider
      value={{
        autoLayoutEnabled,
        setAutoLayoutEnabled,
        loadedDiagramFromOutside,
        setLoadedDiagramFromOutside,
      }}
    >
      <div className="flex h-screen w-screen flex-col">
        <div className="flex h-[10%] w-full justify-between border-b border-b-border  bg-[#232730] min-[1340px]:h-[5%]">
          <Header onErDocChange={onErDocChange} />
        </div>
        <div className="h-[90%] w-full min-[1340px]:h-[95%]">
          <Body erDoc={erDoc} onErDocChange={onErDocChange} />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Page;
