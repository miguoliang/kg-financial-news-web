import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const variantLine = definePartsStyle({
  tablist: {
    borderColor: "gray.100",
  },
  tab: {
    color: "gray.400",
    _selected: {
      color: "blue.500",
      borderBottomColor: "blue.500",
    },
  },
});

// export the component theme
export const tabsTheme = defineMultiStyleConfig({
  variants: { line: variantLine },
});
