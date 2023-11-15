"use client";
import { useState } from "react";
import Body from "../components/Body";
import Header from "../components/Header/Header";
import { Context } from "../context";

const Page = () => {
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState<boolean | null>(
    null,
  );
  const [loadedDiagramFromOutside, setLoadedDiagramFromOutside] =
    useState<boolean>(false);

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
          <Header />
        </div>
        <div className="h-[90%] w-full min-[1340px]:h-[95%]">
          <Body />
        </div>
      </div>
    </Context.Provider>
  );
};

export default Page;
