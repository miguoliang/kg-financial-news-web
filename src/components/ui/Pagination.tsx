import { Table } from "@tanstack/react-table";
import { RowData } from "@tanstack/table-core";
import { Button, HStack, Icon, IconButton, Spacer, useBoolean } from "@chakra-ui/react";
import Select from "react-select";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { useMemo } from "react";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";

const PAGER_COUNT = 7;

interface PaginationProps<TData extends RowData> {
  table: Table<TData>;
}

function getPagerArray(showPrevMore: boolean, showNextMore: boolean, pageIndex: number, pageCount: number) {
  const pagerArray = [];
  if (showPrevMore && !showNextMore) {
    const startPage = pageCount - (PAGER_COUNT - 2);
    for (let i = startPage; i < pageCount; i++) {
      pagerArray.push(i - 1);
    }
  } else if (!showPrevMore && showNextMore) {
    for (let i = 2; i < PAGER_COUNT; i++) {
      pagerArray.push(i - 1);
    }
  } else if (showPrevMore && showNextMore) {
    const offset = Math.floor(PAGER_COUNT / 2) - 1;
    const maxRange = pageIndex >= pageCount - 2 && pageIndex <= pageCount;
    for (
      let i = pageIndex - offset;
      i <= pageIndex + (maxRange ? 0 : offset);
      i++
    ) {
      pagerArray.push(i - 1);
    }
  } else {
    for (let i = 2; i < pageCount; i++) {
      pagerArray.push(i - 1);
    }


  }
  if (pagerArray.length > PAGER_COUNT - 2) {
    return [];
  }
  return pagerArray;
}

function Pagination<TData extends RowData>({ table }: PaginationProps<TData>) {
  const [isHoverShowPrevMore, setIsHoverShowPrevMore] = useBoolean(false);
  const [isHoverShowNextMore, setIsHoverShowNextMore] = useBoolean(false);
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const { showPrevMore, showNextMore, pagerArray } = useMemo(() => {
    let showPrevMore = false;
    let showNextMore = false;
    if (pageCount > PAGER_COUNT) {
      if (pageIndex > PAGER_COUNT - 2) {
        showPrevMore = true;
      }
      if (pageIndex < pageCount - 2) {
        showNextMore = true;
      }
      if (pageIndex >= pageCount - 3 && pageIndex <= pageCount) {
        showNextMore = false;
      }
      if (pageIndex >= 1 && pageIndex <= 4) {
        showPrevMore = false;
      }
    }
    const pagerArray = getPagerArray(showPrevMore, showNextMore, pageIndex, pageCount);
    return { showPrevMore, showNextMore, pagerArray };
  }, [pageIndex, pageSize, pageCount]);

  return <HStack gap={2} justifyContent={"center"} py={5}>
    <IconButton
      variant={"paginationButton"}
      size={"sm"}
      icon={<Icon as={HiOutlineChevronLeft} />}
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()} aria-label={"previous page"} />
    <Button variant={"paginationButton"} size={"sm"} onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>1</Button>
    {showPrevMore &&
      <IconButton icon={<Icon as={isHoverShowPrevMore ? HiOutlineChevronDoubleLeft : HiOutlineEllipsisHorizontal} />}
                  size={"sm"}
                  onClick={() => table.setPageIndex(pageIndex - 5)}
                  onMouseOver={setIsHoverShowPrevMore.on}
                  onMouseOut={setIsHoverShowPrevMore.off}
                  aria-label={"show previous more"} />}
    {pagerArray.map((page) =>
      <Button variant={"paginationButton"} size={"sm"} key={page} onClick={() => table.setPageIndex(page)}>
        {page + 1}
      </Button>,
    )}
    {showNextMore &&
      <IconButton variant={"paginationButton"}
                  size={"sm"}
                  icon={<Icon as={isHoverShowNextMore ? HiOutlineChevronDoubleRight : HiOutlineEllipsisHorizontal} />}
                  onClick={() => table.setPageIndex(pageIndex + 5)}
                  onMouseOver={setIsHoverShowNextMore.on}
                  onMouseOut={setIsHoverShowNextMore.off}
                  aria-label={"show next more"} />}
    <IconButton
      variant={"paginationButton"}
      size={"sm"}
      icon={<Icon as={HiOutlineChevronRight} />}
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()} aria-label={"next page"} />
    <Spacer />
    <Select
      options={[10, 20, 30, 40, 50].map(pageSize => ({ value: pageSize, label: `${pageSize} / Page` }))}
      defaultValue={{ value: pageSize, label: `${pageSize} / Page` }}
      menuPlacement={"auto"}
      onChange={(newValue) => table.setPageSize(newValue?.value ?? 10)}
      components={{
        IndicatorSeparator: null,
      }} />
  </HStack>;
}

export default Pagination;