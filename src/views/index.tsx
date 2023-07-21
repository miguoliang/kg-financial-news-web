import React, { Suspense } from "react";
import { protectedRoutes, publicRoutes } from "configs/routes.config";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "components/route/ProtectedRoute";
import PublicRoute from "components/route/PublicRoute";
import AuthorityGuard from "components/route/AuthorityGuard";
import AppRoute from "components/route/AppRoute";
import { Heading } from "@chakra-ui/react";
import Loading from "components/ui/Loading";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path={"/dashboard"} element={<ProtectedRoute />}>
        {protectedRoutes.map((route, index) => (
          <Route
            key={route.key + index}
            path={route.path}
            element={
              <AuthorityGuard authority={route.authority}>
                {route.meta?.header && (
                  <Heading
                    as={"h3"}
                    size={"1.5rem"}
                    fontWeight={"semibold"}
                    marginBottom={4}
                  >
                    {route.meta.header}
                  </Heading>
                )}
                <AppRoute
                  routeKey={route.key}
                  component={route.component}
                  {...route.meta}
                />
              </AuthorityGuard>
            }
          />
        ))}
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
                {...route.meta}
              />
            }
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const Views = (props: Record<string, any>) => {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <AllRoutes {...props} />
    </Suspense>
  );
};

export default Views;
