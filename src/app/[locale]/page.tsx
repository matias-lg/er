"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import Body from "../components/Body";
import Header from "../components/Header/Header";
import { Context } from "../context";
import { useContext, useState } from "react";

const Page = () => {

  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState<boolean>(false);

  return (
    <Context.Provider value={{ autoLayoutEnabled, setAutoLayoutEnabled}}>
    <Grid
      templateAreas={`
     "header"
     "main"
    `}
      gridTemplateRows={"5% auto"}
      h="100%"
      gap="0"
    >
      <GridItem
        mb={0}
        display={"flex"}
        backgroundColor={"#232730"}
        borderBottom={"1px"}
        borderBottomColor={"rgb(248 250 252 / 0.16)"}
        area="header"
      >
        <Header />
      </GridItem>

      <GridItem
        overflow={"hidden"}
        area={"main"}
        display={"flex"}
        w={"100%"}
        flexDir={"row"}
        justifyContent={"space-between"}
      >
        <Body />
      </GridItem>
    </Grid>
    </Context.Provider>
  );
};

export default Page;
