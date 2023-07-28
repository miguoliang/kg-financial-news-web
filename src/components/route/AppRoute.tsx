import React, { LazyExoticComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCurrentRoute } from "hooks";

type AppRouteProps = {
  component: LazyExoticComponent<(props: Record<string, any>) => JSX.Element>;
  routeKey: string;
} & Record<string, any>;

export const AppRoute = ({
  component: Component,
  routeKey,
  ...props
}: AppRouteProps) => {
  const location = useLocation();
  const currentRoute = useCurrentRoute();
  useEffect(() => {
    currentRoute.setKey(routeKey);
  }, [location]);
  return <Component {...props} />;
};
