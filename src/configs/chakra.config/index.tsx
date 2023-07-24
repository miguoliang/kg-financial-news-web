import { extendTheme } from "@chakra-ui/react";
import { menuTheme } from "./menu.config";
import { tableTheme } from "./table.config";
import { inputTheme } from "./input.config";
import { formLabelTheme } from "./form-label.config";
import { formErrorTheme } from "./form-error.config";
import { cardTheme } from "./card.config";
import { buttonTheme } from "./button.config";
import { tooltipTheme } from "./tooltip.config";

import { first, join, mapValues } from "lodash";
import { theme as twTheme } from "twin.macro";

const tailwindTheme = twTheme`` as Record<string, any>;
console.debug("tailwindTheme", tailwindTheme);

function addMissingBaseField(obj?: any, value?: any) {
  return {
    base: value ?? obj?.DEFAULT,
    ...obj,
  };
}

export const theme = extendTheme({
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

console.debug("mergedChakraTheme", theme);
