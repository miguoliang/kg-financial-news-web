import React from "react";
import {
  Avatar,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

const menuList = [
  {
    label: "Dashboard",
    path: `/dashboard`,
    icon: <Icon as={HiOutlineCog} fontSize={"lg"} color={"gray.500"} />,
  },
];

export const UserMenu = () => {
  const auth = useAuth();

  const UserAvatar = (
    <HStack gap={2} px={2}>
      <Avatar size="sm" src="/img/avatars/thumb-1.jpg" />
      <Flex direction={"column"} alignItems={"start"}>
        <Text casing={"capitalize"}>
          user
        </Text>
        <Text fontWeight={"bold"}>{auth.user?.profile.email}</Text>
      </Flex>
    </HStack>
  );

  return (
    <Menu autoSelect={false} placement="bottom-end">
      <MenuButton>{UserAvatar}</MenuButton>
      <MenuList>
        {menuList.map((item) => (
          <MenuItem as={Link} to={item.path} key={item.label} icon={item.icon}>
            {item.label}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem
          icon={<Icon as={HiOutlineLogout} fontSize={"lg"} color={"gray.500"} />}
          onClick={() => auth.signOut()}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
