import { Vertex } from "models";
import { Badge, Box, CloseButton, Divider, Heading, HStack, List, Text } from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { apiGetVertices } from "services/VertexService";
import { useQueryClient } from "@tanstack/react-query";
import { OptionProps } from "react-select";
import { useContext } from "react";
import { GraphContext } from "./Graph";
import { AnimatePresence, motion } from "framer-motion";

interface NodeListProps {
  onHover?: (vertex: Vertex) => void;
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
    }));
  };

  const handleRemoveVertex = (vertex: Vertex) => {
    setVertices(vertices.filter(v => v !== vertex));
  };

  return (
    <Box p={4}>
      <HStack justifyContent={"space-between"} gap={20}>
        <Heading size={"sm"}>Nodes</Heading>
        <AsyncSelect className={"flex-grow"} placeholder={"Search..."}
                     loadOptions={loadOptions}
                     components={{
                       DropdownIndicator: () => null,
                       IndicatorSeparator: () => null,
                       Option: CustomOption,
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

const CustomOption = ({ innerProps, isDisabled, label, isSelected }: OptionProps) => {
  return (
    !isDisabled ? <HStack {...innerProps} lineHeight={7} _hover={{ bg: "gray.300" }}>
      <Text>{label}</Text>
      {isSelected && <Badge>Selected</Badge>}
    </HStack> : null
  );
};

export default NodeList;