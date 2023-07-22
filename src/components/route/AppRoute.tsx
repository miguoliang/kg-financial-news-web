import React, { LazyExoticComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useCurrentRoute from "hooks/useCurrentRoute";

type AppRouteProps = {
  component: LazyExoticComponent<(props: Record<string, any>) => JSX.Element>;
  routeKey: string;
} & Record<string, any>;

const AppRoute = ({
  component: Component,
  routeKey,
  ...props
}: AppRouteProps) => {
  const location = useLocation();
  const themeStore = useCurrentRoute();
  useEffect(() => {
    themeStore.setKey(routeKey);
  }, [location]);
  return <Component {...props} />;
};

export default AppRoute;
