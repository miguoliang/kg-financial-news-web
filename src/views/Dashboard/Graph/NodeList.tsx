import { Vertex } from "models";
import { Box, CloseButton, Divider, Heading, HStack, List, Text } from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { apiGetVertices } from "services/VertexService";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { GraphContext } from "./Graph";
import { AnimatePresence, motion } from "framer-motion";
import { SingleValue } from "react-select";
import { some } from "lodash";

interface NodeListProps {
  onHover?: (vertex: Vertex) => void;
}

type CustomOption = {
  value: string;
  label: string;
  payload: Vertex;
}

const NodeList = ({ onHover }: NodeListProps) => {

  const queryClient = useQueryClient();
  const { vertices, setVertices } = useContext(GraphContext)!;
  const loadOptions = async (inputValue: string) => {
    const res = await queryClient.fetchQuery({
      queryKey: ["vertices", { q: inputValue, page: 0, size: 10 }],
      queryFn: () => apiGetVertices(inputValue, 0, 10).then(resp => resp.data.content),
      initialData: [],
    });
    return (res as Vertex[]).map(v => ({
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
    <Box p={4}>
      <HStack justifyContent={"space-between"} gap={20}>
        <Heading size={"sm"}>Nodes</Heading>
        <AsyncSelect className={"flex-grow"} placeholder={"Search..."}
                     loadOptions={loadOptions}
                     value={null}
                     onChange={handleOptionSelected}
                     components={{
                       DropdownIndicator: () => null,
                       IndicatorSeparator: () => null,
                     }} />
      </HStack>
      <Divider my={4} color={"gray.400"} />
      <List>
        <AnimatePresence>
          {vertices.map((v) => (
            <motion.li key={v.id} className={"leading-10 px-2 rounded-lg hover:bg-gray-100"}
                       exit={{ opacity: 0, height: 0 }}
                       initial={{ opacity: 1, height: "auto" }}
                       transition={{ duration: 0.2 }}
                       onMouseOver={() => onHover?.(v)}>
              <HStack>
                <Text flexShrink={0} flexGrow={1}>{v.name}</Text>
                <CloseButton size={"sm"} borderRadius={"full"} _hover={{ color: "white", bg: "red.500" }}
                             onClick={() => handleRemoveVertex(v)} />
              </HStack>
            </motion.li>
          ))}
        </AnimatePresence>
      </List>
    </Box>
  );
};

export default NodeList;