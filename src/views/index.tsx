import React, { Suspense } from "react";
import { protectedRoutes, publicRoutes } from "configs/routes";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "components/route/ProtectedRoute";
import PublicRoute from "components/route/PublicRoute";
import AuthorityGuard from "components/route/AuthorityGuard";
import AppRoute from "components/route/AppRoute";
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
    <Suspense fallback={<Loading loading={true} />}>
      <AllRoutes {...props} />
    </Suspense>
  );
};

export default Views;
