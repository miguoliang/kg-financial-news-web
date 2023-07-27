import { formErrorAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  cssVar,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleText = defineStyle({
  position: "absolute",
  mt: 0,
  bottom: "-21px",
});

const baseStyleIcon = defineStyle({
  position: "absolute",
  marginEnd: 0,
  bottom: "-21px",
});

const baseStyle = definePartsStyle({
  text: baseStyleText,
  icon: baseStyleIcon,
});

export const formErrorTheme = defineMultiStyleConfig({
  baseStyle,
});
