import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

// define the base component styles
const variantOutline = definePartsStyle({
  // define the part you're going to style
  field: {
    bg: "white",
  },
});
// export the base styles in the component theme
export const inputTheme = defineMultiStyleConfig({
  variants: { outline: variantOutline },
});
