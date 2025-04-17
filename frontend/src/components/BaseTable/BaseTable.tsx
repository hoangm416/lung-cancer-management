import { useState, useEffect, useRef } from 'react'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type Row,
  getExpandedRowModel,
  type VisibilityState,
  type ColumnFiltersState,
  type FilterFn,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

import { ScrollArea, ScrollBar } from '../ui/scroll-area' 
// import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox' 
import { useSpinDelay } from 'spin-delay'

import { cn } from '@/lib/utils'
import { PaginationRender } from './Pagination/PaginationRender'
import { ExportTable } from './ExportTable/ExportTable'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData, TValue> {
    rowSpan?: number
  }
}

type BaseTableProps<T extends Record<string, any>> = {
  data: T[]
  columns: ColumnDef<T, string>[]
  offset?: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  total?: number
  isPreviousData: boolean
  isLoading: boolean
  className?: string
  classNameHeightTableCell?: string
  renderSubComponent?: (row: Row<T>) => React.ReactNode
  getRowCanExpand?: (row: Row<T>) => boolean
  colsVisibility?: VisibilityState
  popoverClassName?: string
  isAbsoluteBtn?: boolean
  onDataText?: string
  refreshBtn?: boolean
  rowSelection?: { [key: string]: boolean }
  setRowSelection: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
  formatExcel?: Array<{ [key: string]: unknown }>
  filterBtnClassName?: string
  isCheckbox?: boolean
  utilityButton?: React.ReactNode
  deleteSelected?: () => void
  isSearchData?: boolean
  hasBorderRight?: boolean
  limit?: number
  fileNameExcel?: string
  onRowClick?: (row: T) => void
}

export function BaseTable<T extends Record<string, any>>({
  data = [],
  columns,
  offset = 0,
  setOffset,
  total,
  isPreviousData,
  isLoading,
  className,
  classNameHeightTableCell,
  renderSubComponent,
  getRowCanExpand,
  colsVisibility = {},
  popoverClassName = 'absolute right-0 top-[-40px] hidden',
  isAbsoluteBtn = true,
  onDataText,
  rowSelection = {},
  setRowSelection,
  formatExcel = [],
  fileNameExcel,
  filterBtnClassName = 'absolute top-[-20px] right-0 z-50',
  isCheckbox = true,
  utilityButton,
  deleteSelected,
  isSearchData,
  hasBorderRight,
  limit = 10000,
  onRowClick,
}: BaseTableProps<T>) {
  const ref = useRef(null)

  const tableIndex = useRef(0)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>()
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(colsVisibility)

  function addCheckbox() {
    columns.unshift({
      id: 'select',
      header: ({ table }) => (
        <div className="flex cursor-pointer justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={value => {
              // table.toggleAllRowsSelected(!!value)
              table.toggleAllPageRowsSelected(!!value)
            }}
            aria-label="Chọn tất cả"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex cursor-pointer justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={value => {
              row.toggleSelected(!!value)
            }}
          />
        </div>
      ),
    })
  }

  if (isCheckbox && !columns.find(col => col.id === 'select')) {
    addCheckbox()
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    getRowCanExpand,
    onColumnVisibilityChange: setColumnVisibility,
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getRowId: row => (row.id ? row.id : row.user_id),
    // initialState: {
    //   pagination: {
    //     pageSize: 500,
    //   },
    // },
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })
  const totalAttributes = total || data?.length

  useEffect(() => {
    setTimeout(() => {
      if (isSearchData) {
        setOffset(0)
        table.setPageIndex(0)
        tableIndex.current = 0
      } else {
        table.setPageIndex(
          tableIndex.current - offset / table.getState().pagination.pageSize,
        )
      }
    }, 1)
  }, [data])

  const showProgress = useSpinDelay(isLoading, {
    delay: 500,
    minDuration: 100,
  })

  return (
    <div className="h-[calc(100vh_-_220px)]">
      <div
        ref={ref}
        className="flex w-full flex-col gap-4 font-bold text-primary md:flex-row md:items-center md:justify-between"
      >
        <div>
          Kết quả tìm kiếm {'('}
          {totalAttributes || 0}
          {')'}
          {Object.keys(rowSelection).length > 0 && (
            <span>
              {' '}
              - Đã chọn {'('}
              {Object.keys(rowSelection).length || 0}
              {')'}
            </span>
          )}
        </div>
        <div className="flex flex-row">
          {utilityButton}
          <ExportTable
            refComponent={ref}
            rowSelection={rowSelection}
            fileNameExcel={fileNameExcel}
            formatExcel={formatExcel}
          />
        </div>
      </div>

      <div className="my-4 h-[90%] overflow-x-auto">
        <ScrollArea
          className={cn(
            'relative z-30 flex grow flex-col justify-between overflow-hidden',
            className,
          )}
        >
          {isPreviousData && offset == 0 ? null : (
            <>
              <Table
                className={cn('h-full', className)}
                id="table-ref"
              >
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => {
                    return (
                      <TableRow key={headerGroup.id} className="">
                        {headerGroup.headers.map(header => {
                          const rowSpan = header.column.columnDef.meta?.rowSpan
                          if (
                            !header.isPlaceholder &&
                            rowSpan !== undefined &&
                            header.id === header.column.id
                          ) {
                            return null
                          }

                          return (
                            <TableHead
                              key={header.id}
                              className={cn(
                                '',
                                header.id === 'select'
                                  ? 'w-10 px-2'
                                  : header.id === 'edit' ||
                                      header.id === 'view' ||
                                      header.id === 'delete'
                                    ? 'w-10 px-2'
                                    : hasBorderRight
                                      ? 'border-r'
                                      : '',
                                'min-w-[50px] max-w-[150px] overflow-hidden whitespace-nowrap break-words px-2 py-0 text-left',
                              )}
                              colSpan={header.colSpan}
                              rowSpan={
                                header.id === 'select'
                                  ? 2
                                  : !header.isPlaceholder
                                    ? rowSpan
                                    : 1
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableHeader>
                <TableBody>
                  {totalAttributes > 0 ? (
                    table.getRowModel().rows.map(row => {
                      return (
                        <TableRow 
                          key={row.id} 
                          className="box-border text-base cursor-pointer"
                          onClick={() => onRowClick?.(row.original)} // Gọi hàm onRowClick nếu được truyền
                        >
                          {row.getVisibleCells().map((cell, index) => {
                            const cellContent = flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                            return (
                              <TableCell
                                key={index}
                                className={cn(
                                  'min-w-[50px] max-w-[150px] !overflow-hidden !truncate !whitespace-nowrap !break-words px-2 py-0 text-left',
                                  classNameHeightTableCell,
                                )}
                              >
                                {cellContent}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={999}
                        className="h-[600px] text-center"
                      >
                        {showProgress && "Đang tải dữ liệu..."}
                        {!isLoading && (onDataText || "Không có dữ liệu")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {totalAttributes >= 0 && (
        <PaginationRender
          totalAttrs={totalAttributes}
          limitPagination={limit}
          offset={offset}
          setOffset={setOffset}
          isPreviousData={isPreviousData}
          table={table}
          isAbsoluteBtn={isAbsoluteBtn}
          setPageSize={table.setPageSize}
          tableIndex={tableIndex}
          isSearchData={isSearchData}
        />
      )}
    </div>
  )
}
