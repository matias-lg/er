"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import Body from "../components/Body";
import Header from "../components/Header";
import { colors } from "../util/colors";

const Page = () => {
  return (
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
        textColor={"white"}
        display={"flex"}
        justifyContent={"between"}
        paddingY={2}
        paddingX={4}
        flex={"wrap"}
        backgroundColor={colors.textEditorBackground}
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
  );
};

export default Page;
