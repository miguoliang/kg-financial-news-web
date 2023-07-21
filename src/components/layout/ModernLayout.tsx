import React from "react";
import UserMenu from "components/template/UserMenu";
import SideNav from "components/template/SideNav";
import View from "views";
import { useAuth } from "hooks/useAuth";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { useSideNav } from "../../hooks/useSideNav";
import { HiOutlineMenu } from "react-icons/hi";

export const SignInAndSignUp = () => {
  const auth = useAuth();
  return (
    <HStack spacing={4}>
      <Button
        rounded={"full"}
        className={"capitalize"}
        borderWidth={2}
        borderColor={"white"}
        bg={"white"}
        _hover={{ bg: "gray.100", borderColor: "gray.100" }}
        onClick={() => auth.userManager.signinRedirect()}
      >
        sign in
      </Button>
      <Button
        rounded={"full"}
        className={"capitalize"}
        borderWidth={2}
        color={"white"}
        borderColor={"purple.600"}
        bg={"purple.600"}
        _hover={{ bg: "purple.500" }}
        onClick={() => auth.signOut()}
      >
        sign up
      </Button>
    </HStack>
  );
};

const HeaderActionsStart = () => {
  const sideNav = useSideNav();
  return (
    <IconButton
      bg={"transparent"}
      isRound={true}
      aria-label={"menu"}
      fontSize={4}
      icon={<Icon as={HiOutlineMenu} />}
      onClick={() => sideNav.setCollapsed(!sideNav.collapsed)}
    />
  );
};

const HeaderActionsEnd = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  return (
    <HStack spacing={2}>
      {isAuthenticated ? <UserMenu /> : <SignInAndSignUp />}
    </HStack>
  );
};

const ModernLayout = (props: Record<string, any>) => {
  return (
    <Flex>
      <SideNav />
      <Box width={"full"} height={"100vh"} position={"relative"}>
        <Flex
          borderBottom={"1px"}
          alignItems={"center"}
          borderColor={"gray.200"}
          height={16}
          className={"sticky"}
          paddingX={4}
          as={"header"}
          zIndex={"sticky"}
        >
          <HeaderActionsStart />
          <Spacer />
          <HeaderActionsEnd />
        </Flex>
        <Box
          position={"absolute"}
          left={0}
          bottom={0}
          right={0}
          top={16}
          overflow={"auto"}
          paddingX={8}
          paddingY={6}
        >
          <View {...props} />
        </Box>
      </Box>
    </Flex>
  );
};

export default ModernLayout;
