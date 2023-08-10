import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import RecordCountGrowthChart from "./RecordCountGrowthChart";

const KnowledgeCharts = () => {

  return (
    <Box borderRadius={"xl"} borderWidth={1} w={"full"} h={"full"}>
      <Tabs isLazy display={"flex"} flexDirection={"column"} h={"full"}>
        <TabList>
          <Tab py={3} fontSize={"sm"} fontWeight={"semibold"}>
            Knowledge
          </Tab>
        </TabList>
        <TabPanels position={"relative"} flexGrow={1}>
          <TabPanel p={0} h={"full"}>
            <RecordCountGrowthChart w={"full"} h={"full"} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default KnowledgeCharts;