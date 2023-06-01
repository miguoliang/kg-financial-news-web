import React, { lazy, memo, Suspense } from "react";
import { Loading } from "components/shared";
import useDirection from "utils/hooks/useDirection";
import useLocale from "utils/hooks/useLocale";
import { RootState } from "../../store";
import { useAppSelector } from "store/hooks";
import CookieConsent from "react-cookie-consent";

const layouts: Record<
  string,
  React.LazyExoticComponent<(props: Record<string, any>) => JSX.Element>
> = {
  modern: lazy(() => import("./ModernLayout")),
};

const Layout = () => {
  const layoutType = useAppSelector(
    (state: RootState) => state.theme.layout.type,
  );

  useDirection();

  useLocale();

  const AppLayout = layouts[layoutType];

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <Loading loading={true} />
        </div>
      }
    >
      <AppLayout />
      <CookieConsent enableDeclineButton flipButtons>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </Suspense>
  );
};

export default memo(Layout);
