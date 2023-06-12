import React, { useEffect } from "react";
import Header from "components/template/Header";
import UserDropdown from "components/template/UserDropdown";
import LanguageSelector from "components/template/LanguageSelector";
import HeaderLogo from "components/template/HeaderLogo";
import MobileNav from "components/template/MobileNav";
import View from "views";
import { useAuth } from "react-oidc-context";
import { SignInAndSignUp } from "./ModernLayout";

const HeaderActionsStart = () => {
  return (
    <>
      <HeaderLogo />
      <MobileNav />
    </>
  );
};

const HeaderActionsEnd = () => {
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated);
  }, [auth.isAuthenticated]);
  return (
    <>
      <LanguageSelector />
      {isAuthenticated ? (
        <UserDropdown hoverable={false} />
      ) : (
        <SignInAndSignUp />
      )}
    </>
  );
};

const SimpleLayout = () => {
  return (
    <div className="app-layout-simple flex flex-auto flex-col min-h-screen">
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          <Header
            container
            className="shadow dark:shadow-2xl"
            headerStart={<HeaderActionsStart />}
            headerEnd={<HeaderActionsEnd />}
          />
          <View pageContainerType="contained" />
        </div>
      </div>
    </div>
  );
};

export default SimpleLayout;