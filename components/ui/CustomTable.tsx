import React, { useState, useMemo } from 'react';
import { Input } from './Input';
import { Typography } from './Typography';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Column<T> {
  label: string;
  key?: keyof T | ((row: T) => unknown);
  render?: (props: { value: unknown; row: T }) => React.ReactNode;
  filterable?: boolean;
  filterMethod?: (filterValue: string, row: T) => boolean;
  sortable?: boolean;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  enablePagination?: boolean;
  manualPagination?: boolean;
  onPageChange?: (newPage: number) => void;
  totalRows?: number;
  page?: number;
  loading?: boolean;
}

export function CustomTable<T>({
  columns,
  data,
  pageSize = 10,
  enablePagination = true,
  manualPagination = false,
  onPageChange,
  totalRows,
  page: propPage,
  loading = false
}: CustomTableProps<T>) {

  const [internalPage, setInternalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ sortKey: string; direction: 'asc' | 'desc' } | null>(null);

  const page = manualPagination && propPage !== undefined ? propPage : internalPage;

  const handleFilterChange = (label: string, value: string) => {
    setFilters((prev) => ({ ...prev, [label]: value }));
    if (manualPagination && onPageChange) {
        onPageChange(0);
    } else {
        setInternalPage(0);
    }
  };

  const handleSort = (label: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.sortKey === label && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ sortKey: label, direction });
  };

  const filteredData = useMemo(() => {
    return (data || []).filter((row) => {
      return columns.every((col) => {
        const filterValue = filters[col.label];
        if (!col.filterable || !filterValue) return true;

        if (col.filterMethod) {
          return col.filterMethod(filterValue, row);
        }

        const cellValue = typeof col.key === 'function'
            ? col.key(row)
            : col.key ? row[col.key as keyof T] : '';

        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [data, filters, columns]);

  const sortedData = useMemo(() => {
      if (!sortConfig) return filteredData;

      const col = columns.find(c => c.label === sortConfig.sortKey);
      if (!col) return filteredData;

      return [...filteredData].sort((a, b) => {
          const valA = typeof col.key === 'function' ? col.key(a) : col.key ? a[col.key as keyof T] : '';
          const valB = typeof col.key === 'function' ? col.key(b) : col.key ? b[col.key as keyof T] : '';

          if (typeof valA === 'number' && typeof valB === 'number') {
              return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
          }
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredData, sortConfig, columns]);

  const paginatedData = enablePagination && !manualPagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  const handleChangePage = (newPage: number) => {
    if (manualPagination && onPageChange) {
        onPageChange(newPage);
    } else {
        setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    if (manualPagination && onPageChange) {
        onPageChange(0);
    } else {
        setInternalPage(0);
    }
  };

  const getValue = (row: T, col: Column<T>) => {
      if (typeof col.key === 'function') {
          return col.key(row);
      }
      return col.key ? row[col.key as keyof T] : '';
  };

  const totalCount = manualPagination && totalRows !== undefined ? totalRows : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const startRow = totalCount === 0 ? 0 : page * rowsPerPage + 1;
  const endRow = Math.min(totalCount, (page + 1) * rowsPerPage);

  return (
    <div className="relative w-full">
      <div className="overflow-x-auto rounded-t-lg border border-[#00f3ff]/10 bg-white/[0.02] backdrop-blur-md">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                    key={col.label}
                    className="border-b border-[#00f3ff]/20 bg-[rgba(10,10,10,0.95)] px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#00f3ff]"
                >
                  <div className="flex items-center gap-1" style={{ cursor: col.sortable ? 'pointer' : 'default' }} onClick={() => col.sortable && handleSort(col.label)}>
                    {col.label}
                    {col.sortable && sortConfig?.sortKey === col.label && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                  {col.filterable && (
                      <Input
                        placeholder="Filtrar..."
                        value={filters[col.label] || ''}
                        onChange={(e) => handleFilterChange(col.label, e.target.value)}
                        className="mt-1 mb-0 rounded border-white/10 bg-black/30 py-1 text-[0.7rem] font-normal normal-case tracking-normal text-white/70"
                        containerClassName="mb-0"
                      />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative">
            {loading ? (
                <tr>
                    <td colSpan={columns.length} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <div className="h-10 w-10 rounded-full border-4 border-[#00f3ff]/10" style={{ borderTopColor: '#00f3ff' }} />
                            </motion.div>
                            <Typography variant="caption" className="tracking-[2px] font-bold text-[#00f3ff]">CARGANDO PROTOCOLOS...</Typography>
                        </div>
                    </td>
                </tr>
            ) : paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                    style={{
                        backgroundColor: 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'default',
                        position: 'relative',
                        zIndex: 1
                    }}
                    className="hover:bg-cyan-500/5 transition-colors group"
                >
                    {columns.map((col) => {
                    const value = getValue(row, col);
                    return (
                        <td
                            key={col.label}
                            className="px-4 py-3 font-mono text-[0.85rem] text-white/90"
                        >
                        {col.render ? (
                            <col.render value={value} row={row} />
                        ) : (
                            String(value)
                        )}
                        </td>
                    );
                    })}
                </motion.tr>
                ))
            ) : (
                <tr>
                    <td colSpan={columns.length} className="py-6 text-center font-mono text-white/40">
                        {'// [DATA_NOT_FOUND]'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-end gap-4 rounded-b-lg border border-t-0 border-[#00f3ff]/10 bg-black/20 px-4 py-2 font-mono text-xs text-white/60">
            <div className="flex items-center gap-2">
                <span>Filas por página:</span>
                <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="rounded border border-white/10 bg-black/40 px-1 py-0.5 text-[#00f3ff] focus:outline-none"
                >
                    {[5, 10, 25].map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>
            <span>{startRow}-{endRow} de {totalCount}</span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                    className="rounded p-1 text-[#00f3ff] transition-colors hover:bg-white/5 disabled:text-white/20 disabled:hover:bg-transparent"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="rounded p-1 text-[#00f3ff] transition-colors hover:bg-white/5 disabled:text-white/20 disabled:hover:bg-transparent"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
