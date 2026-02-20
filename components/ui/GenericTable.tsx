// 1-Definir componente de tabla genérica reutilizable
// 2-Gestionar estado de paginación y filtros
// 3-Manejar cambios en filtros y ordenamiento
// 4-Calcular datos filtrados y ordenados
// 5-Manejar paginación
// 6-Renderizar estructura de la tabla y controles

//# 1-Definir componente de tabla genérica reutilizable
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
  Box
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
}

export function GenericTable<T>({ 
  columns, 
  data, 
  pageSize = 10,
  enablePagination = true,
  manualPagination = false,
  onPageChange,
  totalRows,
  page: propPage
}: GenericTableProps<T>) {
  
  //# 2-Gestionar estado de paginación y filtros
  const [internalPage, setInternalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const page = manualPagination && propPage !== undefined ? propPage : internalPage;

  //# 3-Manejar cambios en filtros y ordenamiento
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

  //# 4-Calcular datos filtrados y ordenados
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

  //# 5-Manejar paginación
  const paginatedData = enablePagination && !manualPagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : manualPagination && data.length > rowsPerPage
        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedData;

  
  
  //# 8-Manejo de cambios en el input page
  const handleChangePage = (event: unknown, newPage: number) => {
    if (manualPagination && onPageChange) {
        onPageChange(newPage);
    } else {
        setInternalPage(newPage);
    }
  };

  
  
  //# 9-Manejo de cambios en el input rowsperpage
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
      return col.accessor ? row[col.accessor] : null;
  };

  
  
  //# 10-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ bgcolor: 'transparent', backgroundImage: 'none', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                    key={col.Header}
                    sx={{ 
                        bgcolor: 'rgba(0,0,0,0.8)', 
                        color: 'text.secondary', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        fontWeight: 'bold',
                        cursor: col.sortable ? 'pointer' : 'default'
                    }}
                    onClick={() => col.sortable && handleSort(col.Header)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {col.Header}
                      {sortConfig?.key === col.Header && (
                          sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                      )}
                  </Box>
                  {col.filterable && (
                      <Input
                        placeholder={`Filter ${col.Header}`}
                        value={filters[col.Header] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(col.Header, e.target.value)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        containerSx={{ mb: 0, mt: 1 }}
                        sx={{ 
                            input: { color: 'white', fontSize: '0.875rem', padding: '6px 8px' },
                            '& .MuiInputBase-input': { padding: '6px 8px' }
                        }}
                      />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                <motion.tr 
                    key={rowIndex} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                    style={{ 
                        backgroundColor: 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'default'
                    }}
                    className="hover:bg-white/5 transition-colors"
                >
                    {columns.map((col) => {
                    const value = getValue(row, col);
                    
                    
                    //# 11-Estructuración y renderizado visual del componente UI
                    return (
                        <TableCell 
                            key={col.Header}
                            sx={{ color: 'white', borderBottom: 'none' }}
                        >
                        {col.Cell ? (
                            <col.Cell value={value} row={row} />
                        ) : (
                            value as React.ReactNode
                        )}
                        </TableCell>
                    );
                    })}
                </motion.tr>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
                        No data found
                    </TableCell>
                </TableRow>
            )}
            
          </TableBody>
        </Table>
      </TableContainer>
      
      {enablePagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={manualPagination && totalRows !== undefined ? totalRows : filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: 'white' }}
        />
      )}
    </Box>
  );
}
