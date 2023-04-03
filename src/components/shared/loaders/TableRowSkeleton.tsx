import React from "react";
import { Skeleton, TBody, Td, Tr } from "components/ui";
import { SkeletonProps } from "../../ui/Skeleton/Skeleton";

type TableRowSkeletonProps = {
  columns: number;
  rows: number;
  avatarInColumns?: number[];
  avatarProps?: SkeletonProps;
};

const TableRowSkeleton = (props: TableRowSkeletonProps) => {
  const { columns = 1, rows = 10, avatarInColumns = [], avatarProps } = props;

  return (
    <TBody>
      {Array.from(new Array(rows), (_, i) => i + 0).map((row) => (
        <Tr key={`row-${row}`}>
          {Array.from(new Array(columns), (_, i) => i + 0).map((col) => (
            <Td key={`col-${col}`}>
              <div className="flex flex-auto items-center gap-2">
                {avatarInColumns.includes(col) && (
                  <div>
                    <Skeleton variant="circle" {...avatarProps} />
                  </div>
                )}
                <Skeleton />
              </div>
            </Td>
          ))}
        </Tr>
      ))}
    </TBody>
  );
};

export default TableRowSkeleton;
