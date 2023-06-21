import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { intersection } from "lodash";
import { Stack } from "@chakra-ui/react";

export type AuthorityGuardType = PropsWithChildren<{
  authority?: string[];
}>;

const AuthorityGuard = (props: AuthorityGuardType) => {
  const { authority = [], children } = props;

  const scopes = useAuth((state) => state.user?.scopes ?? []);
  const roleMatched =
    authority.length === 0 || intersection(scopes, authority).length > 0;

  return (
    <Stack className="h-full">
      {roleMatched ? children : <Navigate to="/access-denied" />}
    </Stack>
  );
};

export default AuthorityGuard;
