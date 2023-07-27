import { cardAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const variants = {
  elevated: definePartsStyle({
    container: {
      shadow: "none",
      borderWidth: "1px",
      borderColor: "gray.200",
    },
  }),
};

export const cardTheme = defineMultiStyleConfig({
  variants,
});
