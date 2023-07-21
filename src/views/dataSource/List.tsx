import { useEffect, useState } from "react";
import { apiGetDataSources } from "services/DataSourceService";
import { DataSource } from "models/data-source";
import { Box, Table, Tbody, Td, Th, Thead, Tr, useBoolean } from "@chakra-ui/react";
import DatePicker from "react-date-picker";
import { HiOutlineCalendar } from "react-icons/hi";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import appConfig from "configs/app.config";
import Loading from "components/ui/Loading";
import Pagination from "../../components/ui/Pagination";

const columnHelper = createColumnHelper<DataSource>();
const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("title", { header: "Title" }),
  columnHelper.accessor("createdAt", { header: "Created at" }),
  columnHelper.display({
    header: "Operations", cell: (row) => (
      <Link to={`${appConfig.appName}/data-source/${row.cell.getValue()}/knowledge-graph`}>
        Knowledge Graph
      </Link>
    ),
  }),
];

const DataSourceList = () => {

  const [loading, setLoading] = useBoolean();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dataSourceList, setDataSourceList] =
    useState<DataSource[]>([]);

  const table = useReactTable({
    data: dataSourceList,
    columns,
    getCoreRowModel: getCoreRowModel<DataSource>(),
  });

  useEffect(() => {
    setLoading.on();
    apiGetDataSources(selectedDate, { page: currentPage - 1 })
      .then((res) => {
        setDataSourceList(res.data.content);
      })
      .finally(() => {
        setLoading.off();
      });
  }, [currentPage, selectedDate]);

  return (
    <Loading loading={loading} type="cover" className="h-full">
      <Box className="h-full flex flex-col">
        <div className="flex items-center mb-4 flex-shrink-0">
          <span className="flex-shrink-0 mr-4">日期：</span>
          <DatePicker
            className={"w-[180px]"}
            value={selectedDate}
            locale={"en-US"}
            dayPlaceholder={""}
            monthPlaceholder={""}
            yearPlaceholder={""}
            maxDetail={"month"}
            minDetail={"year"}
            calendarIcon={
              <HiOutlineCalendar size={18} className={"text-gray-400"} />
            }
            clearIcon={null}
            format={"y-M-d"}
            prev2Label={null}
            next2Label={null}
            onChange={(date) => {
              setSelectedDate(date as Date);
              setCurrentPage(1);
            }}
          />
        </div>
        <Table className="flex-grow">
          <Thead className="leading-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination table={table} />
      </Box>
    </Loading>
  );
};

export default DataSourceList;
