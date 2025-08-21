import { useMemo, useState } from 'react'
import { cn } from '../../lib/cn'

// --- Column type definition ---
export type Column<T> = {
  key: string
  title: string
  icon?: string
  dataIndex: keyof T
  sortable?: boolean
  render?: (value: T[keyof T], record: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

// --- Props for the DataTable component ---
export interface DataTableProps<T extends Record<string, any>> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  rowKey?: keyof T | ((row: T) => string | number)
  selectionMode?: 'single' | 'multiple'
  className?: string
  emptyMessage?: string
  size?: 'compact' | 'normal' | 'comfortable'
  striped?: boolean
  hover?: boolean
}

// --- Sort state type ---
type SortState<T> = { key: string; order: 'asc' | 'desc' } | null

// --- The utility of this is to get row key based on prop or index ---
function getRowKey<T extends Record<string, any>>(
  row: T,
  idx: number,
  rowKey?: keyof T | ((row: T) => string | number)
) {
  if (!rowKey) return idx
  return typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] as any)
}

// --- compare values for sorting ---
function compareValues(a: unknown, b: unknown) {
  if (a == null && b != null) return -1
  if (a != null && b == null) return 1
  if (a == null && b == null) return 0
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

// --- Sort icon for sortable headers ---
const SortIcon = ({ direction }: { direction?: 'asc' | 'desc' | null }) => (
  <svg 
    className={cn(
      "w-4 h-4 transition-all duration-200",
      direction ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
    )} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    {direction === 'asc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    ) : direction === 'desc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    )}
  </svg>
)

// --- Loading spinner (when loading data) ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
  </div>
)

// --- Empty state (when no data available) ---
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
    <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-sm font-medium">{message}</p>
  </div>
)

// --- Main DataTable component -
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading,
  selectable,
  onRowSelect,
  rowKey,
  selectionMode = 'multiple',
  className,
  emptyMessage = 'No data available',
  size = 'normal',
  striped = false,
  hover = true
}: DataTableProps<T>) {
  // --- Local state for sorting and row selection ---
  const [sort, setSort] = useState<SortState<T>>(null)
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  // --- Predefined size classes for spacing ---
  const sizeClasses = {
    compact: { cell: 'px-3 py-2', header: 'px-3 py-3' },
    normal: { cell: 'px-4 py-3', header: 'px-4 py-4' },
    comfortable: { cell: 'px-6 py-4', header: 'px-6 py-5' }
  }

  // --- Memoized sorted data based on current sort state --
  const sortedData = useMemo(() => {
    if (!sort) return data
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return data
    const dir = sort.order === 'asc' ? 1 : -1
    return [...data]
      .map((row, i) => ({ row, i }))
      .sort((a, b) => {
        const va = a.row[col.dataIndex]
        const vb = b.row[col.dataIndex]
        const cmp = compareValues(va, vb)
        return cmp === 0 ? a.i - b.i : cmp * dir
      })
      .map((x) => x.row)
  }, [data, columns, sort])

  // --- Toggle sorting state for a column ---
  function toggleSort(col: Column<T>) {
    if (!col.sortable) return
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, order: 'asc' }
      return { key: col.key, order: prev.order === 'asc' ? 'desc' : 'asc' }
    })
  }

  // --- Toggle a single row selection ---
  function toggleRow(row: T, idx: number) {
    if (!selectable) return
    const key = getRowKey(row, idx, rowKey)
    setSelected((prev) => {
      const next = new Set(prev)
      if (selectionMode === 'single') {
        next.clear()
        next.add(key)
      } else {
        next.has(key) ? next.delete(key) : next.add(key)
      }
      onRowSelect?.(sortedData.filter((r, i) => next.has(getRowKey(r, i, rowKey))))
      return next
    })
  }

  // --- Check if all rows are selected ---
  const allSelected =
    selectable && sortedData.length > 0 &&
    sortedData.every((r, i) => selected.has(getRowKey(r, i, rowKey)))

  const someSelected = selected.size > 0 && !allSelected

  // --- Toggle select all or clear ---
  function toggleAll() {
    if (!selectable) return
    setSelected((prev) => {
      if (allSelected) return new Set()
      const next = new Set<string | number>()
      sortedData.forEach((r, i) => next.add(getRowKey(r, i, rowKey)))
      onRowSelect?.(sortedData)
      return next
    })
  }

  return (
    <div className={cn(
      'w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden',
      className
    )}>
      {/* --- Selection info bar --- */}
      {selectable && selected.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {selected.size} item{selected.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelected(new Set())}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* --- Table wrapper  --- */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <th className={cn("w-12", sizeClasses[size].header)}>
                  {selectionMode === 'multiple' && (
                    <div className="relative">
                      <input
                        type="checkbox"
                        className={cn(
                          "w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all",
                          "dark:bg-gray-800 dark:border-gray-600",
                          someSelected && "bg-blue-600 border-blue-600"
                        )}
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected
                        }}
                        onChange={toggleAll}
                        aria-label="Select all"
                      />
                    </div>
                  )}
                </th>
              )}

              {/* Render column headers */}
              {columns.map((col) => {
                const isSorted = sort?.key === col.key
                const direction = isSorted ? sort?.order : null
                
                return (
                  <th
                    key={col.key}
                    className={cn(
                      sizeClasses[size].header,
                      "text-left font-semibold text-gray-700 dark:text-gray-300 text-sm tracking-wide",
                      col.align === 'center' && "text-center",
                      col.align === 'right' && "text-right",
                      col.width && `w-${col.width}`
                    )}
                  >
                    {col.sortable ? (
                      // Sortable column with button
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={cn(
                          "group flex items-center space-x-2 font-semibold transition-colors",
                          "hover:text-gray-900 dark:hover:text-gray-100",
                          isSorted && "text-blue-600 dark:text-blue-400"
                        )}
                        aria-label={`Sort by ${col.title}`}
                      >
                        {col.icon && <span className="text-gray-500">{col.icon}</span>}
                        <span>{col.title}</span>
                        <SortIcon direction={direction} />
                      </button>
                    ) : (
                      // Non-sortable column
                      <div className="flex items-center space-x-2">
                        {col.icon && <span className="text-gray-500">{col.icon}</span>}
                        <span>{col.title}</span>
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* --- Table body --- */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Loading state row
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="py-12 text-center"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <LoadingSpinner />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              // Empty state row
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              // Render data rows
              sortedData.map((row, i) => {
                const key = getRowKey(row, i, rowKey)
                const isSelected = selected.has(key)
                
                return (
                  <tr
                    key={String(key)}
                    className={cn(
                      "transition-colors duration-150",
                      hover && "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      striped && i % 2 === 1 && "bg-gray-50/50 dark:bg-gray-800/25",
                      isSelected && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    {/* Selection cell*/}
                    {selectable && (
                      <td className={cn("w-12", sizeClasses[size].cell)}>
                        <input
                          type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                          name={selectionMode === 'single' ? 'table-selection' : undefined}
                          className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all dark:bg-gray-800 dark:border-gray-600"
                          checked={isSelected}
                          onChange={() => toggleRow(row, i)}
                          aria-label={`Select row ${i + 1}`}
                        />
                      </td>
                    )}

                    {/* Render data cells */}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          sizeClasses[size].cell,
                          "text-gray-900 dark:text-gray-100 text-sm",
                          col.align === 'center' && "text-center",
                          col.align === 'right' && "text-right"
                        )}
                      >
                        {col.render 
                          ? col.render(row[col.dataIndex], row) 
                          : (
                            <span className="truncate block">
                              {String(row[col.dataIndex] ?? '')}
                            </span>
                          )
                        }
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
