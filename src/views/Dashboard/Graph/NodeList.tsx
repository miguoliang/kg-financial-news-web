import {
  CloseButton,
  Divider,
  Heading,
  HStack,
  List,
  Text,
  VStack,
} from "@chakra-ui/react";
import AsyncSelect from "react-select/async";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SingleValue } from "react-select";
import some from "lodash-es/some";
import { useGetVertices } from "services";
import { Node } from "reactflow";

type CustomOption = {
  value: string;
  label: string;
};

const NodeList = () => {
  const queryClient = useQueryClient();
  const [nodes, setNodes] = useState<Node[]>([]);
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) {
      return Promise.resolve([]);
    }
    const queryKey = useGetVertices.getKey({
      q: inputValue,
      page: 0,
      size: 10,
    });
    const queryFn = useGetVertices.queryFn;
    const res = await queryClient.fetchQuery({
      queryKey,
      queryFn,
    });
    return res.content.map((v) => ({
      value: v.id,
      label: v.name,
    }));
  };

  const handleRemoveVertex = (node: Node) => {
    setNodes(nodes.filter((v) => v.id !== node.id));
  };

  const handleOptionSelected = (option: SingleValue<CustomOption>) => {
    if (!option || some(nodes, (it) => it.id === option.value)) {
      return;
    }
    setNodes([
      ...nodes,
      {
        id: option.value,
        data: { label: option.label },
        position: { x: 0, y: 0 },
      },
    ]);
  };

  return (
    <VStack p={4} position={"relative"} alignItems={"stretch"} h={"full"}>
      <HStack justifyContent={"space-between"} gap={20}>
        <Heading size={"sm"}>Nodes</Heading>
        <AsyncSelect
          className={"flex-grow"}
          placeholder={"Search and add a node..."}
          loadOptions={loadOptions}
          value={null}
          onChange={handleOptionSelected}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
      </HStack>
      <Divider my={4} color={"gray.400"} />
      <List overflowY={"scroll"} flexGrow={1}>
        <AnimatePresence>
          {nodes.map((v) => (
            <motion.li
              key={v.id}
              className={
                "leading-10 px-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              }
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
            >
              <HStack>
                <Text flexShrink={0} flexGrow={1}>
                  {v.data.label}
                </Text>
                <CloseButton
                  size={"sm"}
                  borderRadius={"full"}
                  _hover={{ color: "white", bg: "red.500" }}
                  onClick={() => handleRemoveVertex(v)}
                />
              </HStack>
            </motion.li>
          ))}
        </AnimatePresence>
      </List>
    </VStack>
  );
};

export default NodeList;
