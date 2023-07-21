import React from "react";
import {USER_SCOPE} from "./oidc.config";
import {Icon} from "@chakra-ui/react";
import {HiOutlineComputerDesktop} from "react-icons/hi2";
import {HiOutlineUsers} from "react-icons/hi";

export type NavigationMenuItem = {
  key: string;
  path?: string;
  title: string;
  translateKey?: string;
  icon?: React.ReactElement;
  type: "item" | "title" | "collapse";
  authority: string[];
  children?: NavigationMenuItem[];
  parentKey?: string;
};

const navigationConfig: NavigationMenuItem[] = [
  {
    key: "apps",
    title: "APPS",
    type: "title",
    authority: [USER_SCOPE],
  },
  {
    key: "dashboard",
    path: "/dashboard",
    title: "Dashboard",
    icon: <Icon as={HiOutlineComputerDesktop} />,
    type: "item",
    authority: [USER_SCOPE],
  },
  {
    key: "data-source",
    title: "Data Source",
    icon: <Icon as={HiOutlineUsers} />,
    type: "collapse",
    authority: [USER_SCOPE],
    children: [
      {
        key: "data-source.list",
        path: "/dashboard/data-source/list",
        title: "List",
        type: "item",
        authority: [USER_SCOPE],
        parentKey: "data-source",
      },
    ],
  },
];

export default navigationConfig;
