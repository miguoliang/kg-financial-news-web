import { apiGetDataSources } from "services/DataSourceService";
import { DataSource } from "models/data-source";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import Loading from "components/ui/Loading";
import { useQuery } from "@tanstack/react-query";
import usePagination from "hooks/usePagination";
import SimpleTable from "components/ui/SimpleTable";

const columnHelper = createColumnHelper<DataSource>();
const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("title", { header: "Title" }),
  columnHelper.accessor("createdAt", { header: "Created at" }),
  columnHelper.display({
    header: "Operations",
    cell: ({ row }) => <Link to={`/dashboard/data-source/${row.original.id}/knowledge-graph`}>
      Knowledge Graph
    </Link>,
  }),
];

const DataSourceList = () => {

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
    pageCount: data?.totalPages ?? 0,
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
      <SimpleTable table={table} />
    </Loading>
  );
};

export default DataSourceList;
