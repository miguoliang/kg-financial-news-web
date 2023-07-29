import KnowledgeStatGroup from "./KnowledgeStatGroup";
import { GridItem, SimpleGrid } from "@chakra-ui/react";

const Dashboard = () => {
  return <SimpleGrid columns={4} gap={8}>
    <KnowledgeStatGroup />
    <GridItem colSpan={3}>Come on</GridItem>
    <GridItem>Hello</GridItem>
  </SimpleGrid>;
};

export default Dashboard;