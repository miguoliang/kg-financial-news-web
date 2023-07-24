import { apiGetDataSources } from "services/DataSourceService";
import { DataSource } from "models/data-source";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Loading from "components/ui/Loading";
import { useQuery } from "@tanstack/react-query";
import usePagination from "hooks/usePagination";
import SimpleTable from "components/ui/SimpleTable";
import { Text } from "@chakra-ui/react";
import { PageHeader } from "./Common";

const columnHelper = createColumnHelper<DataSource>();
const columns = [
  columnHelper.display({
    header: "Row number",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <Text>{pageIndex * pageSize + row.index + 1}</Text>;
    },
  }),
  columnHelper.accessor("title", { header: "Title" }),
  columnHelper.accessor("createdAt", { header: "Created at" }),
  columnHelper.display({
    header: "Operations",
    cell: ({ row }) => <Link to={{
      pathname: `/dashboard/graph`,
      search: "?dataSourceId=" + row.original.id,
    }}>
      Knowledge Graph
    </Link>,
  }),
];

const DataSourceComponent = () => {

  const [pagination, setPagination] = usePagination();

  const { data, isLoading } = useQuery({
    queryKey: ["dataSourceList", pagination],
    queryFn: () => apiGetDataSources(new Date(), { page: pagination.pageIndex, size: pagination.pageSize })
      .then((resp) => resp.data),
    keepPreviousData: true,
  });

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    pageCount: data?.totalPages ?? 1,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel<DataSource>(),
    debugTable: true,
  });

  return (
    <Loading loading={isLoading} type="cover" className="h-full">
      <PageHeader title={"Data Sources"} />
      <SimpleTable table={table} />
    </Loading>
  );
};

export default DataSourceComponent;
