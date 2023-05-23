import React from "react";
import classNames from "classnames";
import { ScrollBar } from "components/ui";
import {
  LOGO_X_GUTTER,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_CONTENT_GUTTER,
  SIDE_NAV_WIDTH,
} from "constants/theme.constant";
import Logo from "components/template/Logo";
import navigationConfig from "configs/navigation.config";
import VerticalMenuContent from "components/template/VerticalMenuContent";
import useResponsive from "utils/hooks/useResponsive";
import { useAppSelector } from "store/hooks";

const sideNavStyle = {
  width: SIDE_NAV_WIDTH,
  minWidth: SIDE_NAV_WIDTH,
};

const sideNavCollapseStyle = {
  width: SIDE_NAV_COLLAPSED_WIDTH,
  minWidth: SIDE_NAV_COLLAPSED_WIDTH,
};

const SideNav = () => {
  const themeColor = useAppSelector((state) => state.theme.themeColor);
  const primaryColorLevel = useAppSelector(
    (state) => state.theme.primaryColorLevel,
  );
  const navMode = useAppSelector((state) => state.theme.navMode);
  const mode = useAppSelector((state) => state.theme.mode);
  const direction = useAppSelector((state) => state.theme.direction);
  const currentRouteKey = useAppSelector(
    (state) => state.base.common.currentRouteKey,
  );

  const sideNavCollapse = useAppSelector(
    (state) => state.theme.layout.sideNavCollapse,
  );
  const userAuthority = useAppSelector((state) => state.auth.user.authority);

  const { larger } = useResponsive();

  const sideNavColor = () => {
    if (navMode === "themed") {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`;
    }
    return `side-nav-${navMode}`;
  };

  const logoMode = () => {
    if (navMode === "themed") {
      return "dark";
    }

    if (navMode === "transparent") {
      return mode;
    }

    return navMode;
  };

  const menuContent = (
    <VerticalMenuContent
      navMode={navMode}
      collapsed={sideNavCollapse}
      navigationTree={navigationConfig}
      routeKey={currentRouteKey}
      userAuthority={userAuthority}
      direction={direction}
    />
  );

  return (
    <>
      {larger.md && (
        <div
          style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
          className={classNames(
            "side-nav",
            sideNavColor(),
            !sideNavCollapse && "side-nav-expand",
          )}
        >
          <div className="side-nav-header">
            <Logo
              mode={logoMode()}
              type={sideNavCollapse ? "streamline" : "full"}
              gutter={sideNavCollapse ? SIDE_NAV_CONTENT_GUTTER : LOGO_X_GUTTER}
            />
          </div>
          {sideNavCollapse ? (
            menuContent
          ) : (
            <div className="side-nav-content">
              <ScrollBar autoHide direction={direction}>
                {menuContent}
              </ScrollBar>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SideNav;
