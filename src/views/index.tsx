import React, { Suspense } from "react";
import { protectedRoutes, publicRoutes } from "configs";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { AppRoute, AuthorityGuard, ProtectedRoute, PublicRoute } from "components/route";

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
            key={route.key}
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
    <Suspense fallback={<Spinner />}>
      <AllRoutes {...props} />
    </Suspense>
  );
};

export default Views;
