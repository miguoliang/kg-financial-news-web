import React, { useMemo } from "react";
import {
  Pagination,
  Select,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "components/ui";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PaginationChangeHandler } from "../../../../components/ui/Pagination/Pagers";

const tableData = () => {
  const arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push({
      firstName: `Maria ${i}`,
      lastName: `Anders ${i}`,
      age: i,
    });
  }
  return arr;
};

const totalData = tableData().length;

const pageSizeOption = [
  { value: 10, label: "10 / page" },
  { value: 20, label: "20 / page" },
  { value: 30, label: "30 / page" },
  { value: 40, label: "40 / page" },
  { value: 50, label: "50 / page" },
];

const PaginationTable = () => {
  const columns = useMemo(
    () => [
      {
        header: "First Name",
        accessorKey: "firstName",
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
      },
      {
        header: "Age",
        accessorKey: "age",
      },
    ],
    []
  );

  const [data] = React.useState(() => tableData());

  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onPaginationChange: PaginationChangeHandler = (page) => {
    table.setPageIndex(page.pageIndex - 1);
  };

  const onSelectChange = (value?: number) => {
    table.setPageSize(Number(value));
  };

  return (
    <div>
      <Table>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </THead>
        <TBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </TBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <Pagination
          pageSize={table.getState().pagination.pageSize}
          currentPage={table.getState().pagination.pageIndex + 1}
          total={totalData}
          onChange={onPaginationChange}
        />
        <div style={{ minWidth: 130 }}>
          <Select<{ value: number; label: string }>
            size="sm"
            isSearchable={false}
            value={pageSizeOption.filter(
              (option) => option.value === table.getState().pagination.pageSize
            )}
            options={pageSizeOption}
            onChange={(option) => onSelectChange(option?.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationTable;
