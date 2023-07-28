import { extendTheme } from "@chakra-ui/react";
import { menuTheme } from "./menu";
import { tableTheme } from "./table";
import { inputTheme } from "./input";
import { formLabelTheme } from "./form-label";
import { formErrorTheme } from "./form-error";
import { cardTheme } from "./card";
import { buttonTheme } from "./button";
import { tooltipTheme } from "./tooltip";
import first from "lodash/first";
import join from "lodash/join";
import mapValues from "lodash/mapValues";
import { theme as twTheme } from "twin.macro";

const tailwindTheme = twTheme`` as Record<string, any>;

function addMissingBaseField(obj?: any, value?: any) {
  return {
    base: value ?? obj?.DEFAULT,
    ...obj,
  };
}

export default extendTheme({
  blur: addMissingBaseField(tailwindTheme.blur),
  breakpoints: addMissingBaseField(tailwindTheme.screens, "0px"),
  colors: tailwindTheme.colors,
  radius: addMissingBaseField(tailwindTheme.borderRadius),
  shadows: addMissingBaseField(tailwindTheme.boxShadow),
  space: addMissingBaseField(tailwindTheme.spacing),
  sizes: {
    container: tailwindTheme.container,
    ...tailwindTheme.spacing,
    ...tailwindTheme.maxWidth,
  },
  transition: {
    duration: tailwindTheme.transitionDuration,
    easing: tailwindTheme.transitionTimingFunction,
    property: tailwindTheme.transitionProperty,
  },
  letterSpacings: tailwindTheme.letterSpacing,
  lineHeights: tailwindTheme.lineHeight,
  fontWeights: tailwindTheme.fontWeight,
  fonts: mapValues(tailwindTheme.fontFamily, (value) => join(value, ",")),
  fontSizes: mapValues(tailwindTheme.fontSize, first),
  zIndices: tailwindTheme.zIndex,
  components: {
    Menu: menuTheme,
    Table: tableTheme,
    Input: inputTheme,
    FormLabel: formLabelTheme,
    FormError: formErrorTheme,
    Card: cardTheme,
    Button: buttonTheme,
    Tooltip: tooltipTheme,
  },
});
