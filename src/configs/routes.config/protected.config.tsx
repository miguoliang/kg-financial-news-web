import React from "react";
import { Routes } from "./types";

const protectedRoutes: Routes = [
  {
    key: "dashboard",
    path: `/dashboard`,
    component: React.lazy(() => import("views/Dashboard")),
  },
  {
    key: "dashboard.data-source.list",
    path: `/dashboard/data-source/list`,
    component: React.lazy(() => import("views/DataSourceList")),
  },
  {
    key: "dashboard.data-source.knowledge-graph",
    path: `/dashboard/data-source/:id/knowledge-graph`,
    component: React.lazy(() => import("views/Graph")),
  },
];

export default protectedRoutes;
