import { FunctionType } from "constants/types";
import { Children, cloneElement, isValidElement } from "react";

function map(children: any | any[], func: FunctionType, context?: any) {
  let index = 0;
  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }
    const handle = func.call(context, child, index);
    index += 1;
    return handle;
  });
}

function mapCloneElement(
  children: any | any[],
  func: FunctionType,
  context?: any
) {
  return map(
    children,
    (child, index) =>
      cloneElement(child, {
        key: index,
        ...func(child, index),
      }),
    context
  );
}

export default mapCloneElement;
