const useMergedRef =
  (...refs: any[]) =>
  (element: any) =>
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(element);
      } else if (ref && typeof ref === "object") {
        ref.current = element;
      }
    });

export default useMergedRef;
