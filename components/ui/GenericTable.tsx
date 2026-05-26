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
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TableContainer 
        sx={{ 
            bgcolor: 'rgba(5, 10, 20, 0.4)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 243, 255, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.02) 1px, transparent 1px)',
            backgroundSize: '100% 40px',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00f3ff, transparent)',
                zIndex: 10
            }
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(0, 243, 255, 0.05)' }}>
              {columns.map((col) => (
                <TableCell 
                    key={col.Header}
                    sx={{ 
                        color: '#00f3ff', 
                        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
                        fontWeight: '900',
                        fontSize: '0.75rem',
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        cursor: col.sortable ? 'pointer' : 'default',
                        py: 2
                    }}
                    onClick={() => col.sortable && handleSort(col.Header)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {col.Header}
                      {sortConfig?.key === col.Header && (
                          <motion.div initial={{ rotate: 0 }} animate={{ rotate: sortConfig.direction === 'asc' ? 0 : 180 }}>
                             <ArrowUpward sx={{ fontSize: 16 }} />
                          </motion.div>
                      )}
                  </Box>
                  {col.filterable && (
                      <Input
                        placeholder={`_FILTRAR_`}
                        value={filters[col.Header] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(col.Header, e.target.value)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        containerSx={{ mb: 0, mt: 1 }}
                        sx={{ 
                            input: { 
                                color: 'rgba(255,255,255,0.7)', 
                                fontSize: '0.65rem', 
                                padding: '4px 6px',
                                fontFamily: 'monospace'
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

            {paginatedData.length > 0 ? (
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
                    
                    
                    //# 11-Estructuración y renderizado visual del componente UI
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
                    '& .MuiTablePagination-actions': { color: '#00f3ff' }
                }}
            />
        </Box>
      )}
    </Box>
  );
}

