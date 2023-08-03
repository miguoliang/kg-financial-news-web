import { Vertex } from "models";
import { CloseButton, Divider, Heading, HStack, List, Text, VStack } from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SingleValue } from "react-select";
import some from "lodash-es/some";
import { useGetVertices } from "services";
import { GraphContext } from "./context";
import { theme } from "twin.macro";

type CustomOption = {
  value: string;
  label: string;
  payload: Vertex;
}

const NodeList = () => {

  const queryClient = useQueryClient();
  const { vertices, setVertices, hoverNode, setHoverNode } = useContext(GraphContext)!;
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) {
      return Promise.resolve([]);
    }
    const queryKey = useGetVertices.getKey({ q: inputValue, page: 0, size: 10 });
    const queryFn = useGetVertices.queryFn;
    const res = await queryClient.fetchQuery({
      queryKey,
      queryFn,
    });
    return res.content.map(v => ({
      value: v.id,
      label: v.name,
      payload: v,
    }));
  };

  const handleRemoveVertex = (vertex: Vertex) => {
    setVertices(vertices.filter(v => v !== vertex));
  };

  const handleOptionSelected = (option: SingleValue<CustomOption>) => {
    if (!option || some(vertices, it => it.id === option.payload.id)) {
      return;
    }
    setVertices([...vertices, option.payload]);
  };

  return (
    <VStack p={4} position={"relative"} alignItems={"stretch"} h={"full"}>
      <HStack justifyContent={"space-between"} gap={20}>
        <Heading size={"sm"}>Nodes</Heading>
        <AsyncSelect className={"flex-grow"} placeholder={"Search and add a node..."}
                     loadOptions={loadOptions}
                     value={null}
                     onChange={handleOptionSelected}
                     components={{
                       DropdownIndicator: () => null,
                       IndicatorSeparator: () => null,
                     }} />
      </HStack>
      <Divider my={4} color={"gray.400"} />
      <List overflowY={"scroll"} flexGrow={1}>
        <AnimatePresence>
          {vertices.map((v) => (
            <motion.li key={v.id} className={"leading-10 px-2 rounded-lg hover:bg-gray-100"}
                       exit={{ opacity: 0, height: 0 }}
                       initial={{ opacity: 1, height: "auto" }}
                       transition={{ duration: 0.2 }}
                       style={{ backgroundColor: v.id === hoverNode ? theme`colors.gray.100` : "transparent" }}
                       onMouseOver={() => setHoverNode(v.id, "list")}
                       onMouseLeave={() => setHoverNode(null, "list")}>
              <HStack>
                <Text flexShrink={0} flexGrow={1}>{v.name}</Text>
                <CloseButton size={"sm"} borderRadius={"full"} _hover={{ color: "white", bg: "red.500" }}
                             onClick={() => handleRemoveVertex(v)} />
              </HStack>
            </motion.li>
          ))}
        </AnimatePresence>
      </List>
    </VStack>
  );
};

export default NodeList;