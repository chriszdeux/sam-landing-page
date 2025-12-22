import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  TablePagination,
  InputAdornment
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';

export interface Column<T> {
  Header: string;
  accessor?: keyof T | ((row: T) => any);
  Cell?: (props: { value: any; row: T }) => React.ReactNode;
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
  const [internalPage, setInternalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const page = manualPagination && propPage !== undefined ? propPage : internalPage;

  // Handle filtering
  const handleFilterChange = (header: string, value: string) => {
    setFilters((prev) => ({ ...prev, [header]: value }));
    if (manualPagination && onPageChange) {
        onPageChange(0);
    } else {
        setInternalPage(0);
    }
  };

  // Handle Sorting
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

        // Default string includes check
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

          if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }, [filteredData, sortConfig, columns]);


  // Pagination logic
  // Pagination logic
  // If manualPagination is true, we assume the parent slices the data or provides the correct page data.
  // HOWEVER, if the parent appends data (like the current reducer implementation), we still need to slice it here 
  // OR the parent passes ONLY the current page data.
  // Based on the user flow (reducer appends), we should slice here if data.length > rowsPerPage
  const paginatedData = enablePagination && !manualPagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : manualPagination && data.length > rowsPerPage // If manual but huge dataset passed (like appended list)
        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedData; // If manual and data is small (just this page), show all.

  const handleChangePage = (event: unknown, newPage: number) => {
    if (manualPagination && onPageChange) {
        onPageChange(newPage);
    } else {
        setInternalPage(newPage);
    }
  };

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
                      <TextField
                        variant="standard"
                        size="small"
                        placeholder={`Filter ${col.Header}`}
                        value={filters[col.Header] || ''}
                        onChange={(e) => handleFilterChange(col.Header, e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking input
                        sx={{ 
                            mt: 1, 
                            input: { color: 'white', fontSize: '0.875rem' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="inherit" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            )
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
                <TableRow 
                    key={rowIndex} 
                    hover
                    sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05) !important' } }}
                >
                    {columns.map((col) => {
                    const value = getValue(row, col);
                    return (
                        <TableCell 
                            key={col.Header}
                            sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                        {col.Cell ? (
                            <col.Cell value={value} row={row} />
                        ) : (
                            value
                        )}
                        </TableCell>
                    );
                    })}
                </TableRow>
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
