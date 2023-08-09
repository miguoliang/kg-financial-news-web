import KnowledgeStatGroup from "./KnowledgeStatGroup";
import { GridItem, SimpleGrid } from "@chakra-ui/react";
import KnowledgeStatChart from "./KnowledgeStatChart";

const Dashboard = () => {
  return <SimpleGrid columns={4} gap={8}>
    <GridItem colSpan={4} w={"full"}>
      <KnowledgeStatGroup />
    </GridItem>
    <GridItem colSpan={3} h={"500px"} position={"relative"}>
      <KnowledgeStatChart />
    </GridItem>
    <GridItem>Hello</GridItem>
  </SimpleGrid>;
};

export default Dashboard;