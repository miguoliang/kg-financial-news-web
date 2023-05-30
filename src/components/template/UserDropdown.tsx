import React from "react";
import { Avatar, Dropdown, DropdownItem } from "components/ui";
import withHeaderItem from "utils/hoc/withHeaderItem";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "react-oidc-context";
import { SIGN_OUT_URL } from "../../configs/oidc.config";
import { APP_PREFIX_PATH } from "../../constants/route.constant";

const dropdownItemList = [
  {
    label: "Account Setting",
    path: `${APP_PREFIX_PATH}/account/settings/profile`,
    icon: <HiOutlineCog />,
  },
];

export const UserDropdown = ({ className }: { className: string }) => {
  const auth = useAuth();

  const UserAvatar = (
    <div className={classNames(className, "flex items-center gap-2")}>
      <Avatar size={32} shape="circle" src={""} />
      <div className="hidden md:block">
        <div className="text-xs capitalize">user</div>
        <div className="font-bold">{auth.user?.profile.email}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        {dropdownItemList.map((item) => (
          <DropdownItem eventKey={item.label} key={item.label} className="mb-1">
            <Link className="flex gap-2 items-center" to={item.path}>
              <span className="text-xl opacity-50">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </DropdownItem>
        ))}
        <DropdownItem dropdownItemVariant="divider" />
        <DropdownItem
          onClick={() => window.location.replace(SIGN_OUT_URL)}
          eventKey="Sign Out"
          className="gap-2"
        >
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export default withHeaderItem(UserDropdown);
