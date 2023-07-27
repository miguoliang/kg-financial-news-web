import React, { ForwardedRef, forwardRef, ReactNode } from "react";
import { Spinner } from "@chakra-ui/react";
import join from "lodash/join";

const DefaultLoading = forwardRef(
  (props: LoadingProps, ref: ForwardedRef<any>) => {
    const {
      loading = false,
      children,
      spinnerClass,
      className,
      asElement: Component = "div",
      customLoader,
    } = props;

    if (loading) {
      return React.createElement(
        Component,
        {
          ref,
          className: `${className} ${!customLoader && "flex items-center justify-center h-full"}`,
        },
        children,
        customLoader ? (
          <>{customLoader}</>
        ) : (
          <Spinner className={spinnerClass} size={"md"} />
        ),
      );
    } else {
      return <>{children}</>;
    }
  },
);

type LoadingProps = {
  loading?: boolean;
  spinnerClass?: string;
  type?: "default" | "cover";
  customLoader?: ReactNode;
  asElement?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  className?: string;
};

const CoveredLoading = forwardRef(
  (props: LoadingProps, ref: ForwardedRef<any>) => {
    const {
      loading = false,
      children,
      spinnerClass,
      className,
      asElement: Component = "div",
      customLoader,
    } = props;

    return React.createElement(
      Component,
      {
        ref,
        className: join(loading ? "relative" : "", className),
      },
      children,
      loading && (
        <div className="w-full h-full bg-white dark:bg-gray-800 dark:bg-opacity-60 bg-opacity-50 absolute inset-0" />
      ),
      loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          {customLoader ? (
            <>{customLoader}</>
          ) : (
            <Spinner className={spinnerClass} size={"md"} />
          )}
        </div>
      ),
    );
  },
);

const Loading = (props: LoadingProps) => {
  switch (props.type) {
    case "default":
      return <DefaultLoading {...props} />;
    case "cover":
      return <CoveredLoading {...props} />;
    default:
      return <DefaultLoading {...props} />;
  }
};
export default Loading;
