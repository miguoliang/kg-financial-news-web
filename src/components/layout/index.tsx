import { lazy, memo, Suspense, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "hooks";
import { Spinner } from "@chakra-ui/react";

const Layout = () => {
  const location = useLocation();

  const AppLayout = useMemo(() => {
    return location.pathname.startsWith("/dashboard")
      ? lazy(() => import("./ModernLayout"))
      : lazy(() => import("./SimpleLayout"));
  }, [location.pathname.startsWith("/dashboard")]);

  const auth = useAuth();
  useEffect(() => {
    if (
      window.location.pathname === "/" &&
      window.location.href.indexOf("code") !== -1
    ) {
      auth.userManager
        .signinRedirectCallback()
        .then(async () => {
          window.history.replaceState({}, document.title, "/");
          const user = await auth.userManager.getUser();
          auth.setUser(user ?? undefined);
          auth.setAuthenticated(true);
        })
        .catch((err) => {
          console.error(err);
          auth.setUser(undefined);
          auth.setAuthenticated(false);
        });
      return;
    }

    auth.userManager
      .getUser()
      .then((user) => {
        if (user && !user.expired) {
          auth.setUser(user);
          auth.setAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error(err);
        auth.setUser(undefined);
        auth.setAuthenticated(false);
      });
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <AppLayout />
    </Suspense>
  );
};

export default memo(Layout);
