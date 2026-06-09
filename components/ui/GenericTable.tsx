import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography
} from '@mui/material';
import { Input } from './Input';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { motion } from 'framer-motion';

export interface Column<T> {
  Header: string;
  accessor?: keyof T | ((row: T) => unknown);
  Cell?: (props: { value: unknown; row: T }) => React.ReactNode;
  filterable?: boolean;
  filterMethod?: (filterValue: string, row: T) => boolean;
  sortable?: boolean;
}

interface GenericTableProps<T> {
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

export function GenericTable<T>({ 
  columns, 
  data, 
  pageSize = 10,
  enablePagination = true,
  manualPagination = false,
  onPageChange,
  totalRows,
  page: propPage,
  loading = false
}: GenericTableProps<T>) {
  
  const [internalPage, setInternalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const page = manualPagination && propPage !== undefined ? propPage : internalPage;

  const handleFilterChange = (header: string, value: string) => {
    setFilters((prev) => ({ ...prev, [header]: value }));
    if (manualPagination && onPageChange) {
        onPageChange(0);
    } else {
        setInternalPage(0);
    }
  };

  const handleSort = (header: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === header && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key: header, direction });
  };

  const filteredData = useMemo(() => {
    return (data || []).filter((row) => {
      return columns.every((col) => {
        const filterValue = filters[col.Header];
        if (!col.filterable || !filterValue) return true;

        if (col.filterMethod) {
          return col.filterMethod(filterValue, row);
        }

        const cellValue = typeof col.accessor === 'function' 
            ? col.accessor(row) 
            : col.accessor ? row[col.accessor] : '';
            
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [data, filters, columns]);

  const sortedData = useMemo(() => {
      if (!sortConfig) return filteredData;
      
      const col = columns.find(c => c.Header === sortConfig.key);
      if (!col) return filteredData;

      return [...filteredData].sort((a, b) => {
          const valA = typeof col.accessor === 'function' ? col.accessor(a) : col.accessor ? a[col.accessor] : '';
          const valB = typeof col.accessor === 'function' ? col.accessor(b) : col.accessor ? b[col.accessor] : '';

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

  const handleChangePage = (_: unknown, newPage: number) => {
    if (manualPagination && onPageChange) {
        onPageChange(newPage);
    } else {
        setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    if (manualPagination && onPageChange) {
        onPageChange(0);
    } else {
        setInternalPage(0);
    }
  };

  const getValue = (row: T, col: Column<T>) => {
      if (typeof col.accessor === 'function') {
          return col.accessor(row);
      }
      return col.accessor ? row[col.accessor] : '';
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TableContainer component={Paper} sx={{ 
          bgcolor: 'rgba(255,255,255,0.02)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 243, 255, 0.1)',
          borderRadius: '8px 8px 0 0',
          boxShadow: 'none',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0, 243, 255, 0.2)', borderRadius: 4 }
      }}>
        <Table stickyHeader sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                    key={col.Header}
                    sx={{ 
                        bgcolor: 'rgba(10, 10, 10, 0.95)', 
                        color: '#00f3ff', 
                        fontWeight: 'bold',
                        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem'
                    }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: col.sortable ? 'pointer' : 'default' }} onClick={() => col.sortable && handleSort(col.Header)}>
                    {col.Header}
                    {col.sortable && sortConfig?.key === col.Header && (
                        sortConfig.direction === 'asc' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />
                    )}
                  </Box>
                  {col.filterable && (
                      <Input
                        size="small"
                        placeholder="Filtrar..."
                        value={filters[col.Header] || ''}
                        onChange={(e) => handleFilterChange(col.Header, e.target.value)}
                        sx={{ 
                            mt: 1, 
                            '& .MuiInputBase-input': { 
                                fontSize: '0.7rem', 
                                py: 0.5,
                                color: 'rgba(255,255,255,0.7)'
                            },
                            '& .MuiInputBase-root': {
                                bgcolor: 'rgba(0,0,0,0.3)',
                                borderRadius: '4px',
                                border: '1px solid rgba(0, 243, 255, 0.1)'
                            }
                        }}
                      />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ position: 'relative' }}>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 8 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Box sx={{ width: 40, height: 40, border: '4px solid rgba(0, 243, 255, 0.1)', borderTopColor: '#00f3ff', borderRadius: '50%' }} />
                            </motion.div>
                            <Typography variant="caption" sx={{ color: '#00f3ff', letterSpacing: 2, fontWeight: 'bold' }}>CARGANDO PROTOCOLOS...</Typography>
                        </Box>
                    </TableCell>
                </TableRow>
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
                        <TableCell 
                            key={col.Header}
                            sx={{ 
                                color: 'rgba(255,255,255,0.9)', 
                                borderBottom: 'none',
                                fontSize: '0.85rem',
                                py: 1.5,
                                fontFamily: 'monospace'
                            }}
                        >
                        {col.Cell ? (
                            <col.Cell value={value} row={row} />
                        ) : (
                            String(value)
                        )}
                        </TableCell>
                    );
                    })}
                </motion.tr>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', py: 6, fontFamily: 'monospace' }}>
                        {'// [DATA_NOT_FOUND]'}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {enablePagination && (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mt: 1,
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: '0 0 8px 8px',
            border: '1px solid rgba(0, 243, 255, 0.1)',
            borderTop: 'none'
        }}>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={manualPagination && totalRows !== undefined ? totalRows : filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    '& .MuiTablePagination-selectIcon': { color: '#00f3ff' },
                    '& .MuiTablePagination-actions': { color: '#00f3ff' },
                    '& .MuiTablePagination-actions .Mui-disabled': { color: 'rgba(255,255,255,0.2) !important' }
                }}
            />
        </Box>
      )}
    </Box>
  );
}
