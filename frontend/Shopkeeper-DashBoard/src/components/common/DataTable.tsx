import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchable = false,
  searchPlaceholder = 'Search records...',
  searchFilter,
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (query && searchFilter) {
      result = result.filter((item) => searchFilter(item, query.toLowerCase()));
    }
    if (sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        return (valA > valB ? 1 : -1) * (sortAsc ? 1 : -1);
      });
    }
    return result;
  }, [data, query, searchFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-subtle flex flex-col justify-between">
      {/* Search Header */}
      {searchable && (
        <div className="p-3.5 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--bg-element)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500 transition-all font-medium"
            />
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            {filteredData.length} records
          </span>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-element)] text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[10px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3 px-4 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.sortable ? 'cursor-pointer select-none hover:text-[var(--text-primary)]' : ''}`}
                  style={{ width: col.width }}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)] text-[var(--text-primary)]">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-[var(--bg-element)]/60 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-[var(--text-muted)] text-xs">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-element)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>
            Page <strong className="text-[var(--text-primary)]">{currentPage}</strong> of{' '}
            <strong className="text-[var(--text-primary)]">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] disabled:opacity-40 hover:bg-[var(--bg-active)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] disabled:opacity-40 hover:bg-[var(--bg-active)] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
