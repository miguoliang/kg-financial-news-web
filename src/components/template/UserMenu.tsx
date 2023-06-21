import React from "react";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import withHeaderItem from "utils/hoc/withHeaderItem";
import { Link } from "react-router-dom";
import classNames from "classnames";
import {
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineCurrencyDollar,
  HiOutlineLogout,
} from "react-icons/hi";
import { APP_PREFIX_PATH } from "../../constants/route.constant";
import { useAuth } from "../../hooks/useAuth";

const menuList = [
  {
    label: "Account",
    path: `${APP_PREFIX_PATH}/account/settings/profile`,
    icon: <HiOutlineCog />,
  },
  {
    label: "Billing",
    path: `${APP_PREFIX_PATH}/account/settings/billing`,
    icon: <HiOutlineCurrencyDollar />,
  },
  {
    label: "Subscription",
    path: `${APP_PREFIX_PATH}/account/settings/subscription`,
    icon: <HiOutlineClock />,
  },
];

export const UserMenu = ({ className }: { className: string }) => {
  const auth = useAuth();

  const UserAvatar = (
    <div className={classNames(className, "flex items-center gap-2")}>
      <Avatar size="sm" src="/img/avatars/thumb-1.jpg" />
      <div className="hidden md:block">
        <div className="text-xs capitalize">user</div>
        <div className="font-bold">{auth.user?.profile.email}</div>
      </div>
    </div>
  );

  return (
    <Menu autoSelect={false} placement="bottom-end">
      <MenuButton>{UserAvatar}</MenuButton>
      <MenuList>
        {menuList.map((item) => (
          <MenuItem
            as={Link}
            to={item.path}
            key={item.label}
            icon={<HiOutlineCog />}
          >
            {item.label}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem icon={<HiOutlineLogout />} onClick={() => auth.signOut()}>
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default withHeaderItem(UserMenu);