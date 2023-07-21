import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

const usePagination = () => useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
});

export default usePagination;