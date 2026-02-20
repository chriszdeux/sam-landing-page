// 1-Importar dependencias y slices de economía
// 2-Obtener estado y despachador de Redux
// 3-Sincronizar lista de activos del mercado
// 4-Manejar interacción y paginación
// 5-Renderizar tabla de activos del mercado

'use client';

//# 1-Importar dependencias y slices de economía
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';


import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchAssets, setPage } from '../../lib/features/economySlice';



export const MarketTable = () => {
  const router = useRouter();
  
  //# 2-Obtener estado y despachador de Redux
  const dispatch = useAppDispatch();
  

  const { assets, loading, error, page, totalPages } = useAppSelector((state) => state.economy);

  
  
  //# 3-Sincronizar lista de activos del mercado
  useEffect(() => {
    dispatch(fetchAssets({ page, limit: 10 }));
  }, [page, dispatch]);

  
  
  //# 4-Manejar interacción y paginación
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  
  

  const handleRowClick = (id: string) => {
    router.push(`/economia-real/${id}`);
  };

  if (loading && assets.length === 0) {
    
    
    //# 5-Renderizar tabla de activos del mercado
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    
    
    //# 9-Estructuración y renderizado visual del componente UI
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  
  
  //# 10-Estructuración y renderizado visual del componente UI
  return (
    <Box>
      <TableContainer component={Paper} sx={{
        bgcolor: 'rgba(10, 10, 26, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        overflow: 'hidden',
        mb: 4
      }}>
        <Table sx={{ minWidth: 650 }} aria-label="market table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>24h %</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Market Cap</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Volumen (24h)</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Suministro</TableCell>
              <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets?.map((row, index) => {
              
              
              
              //# 11-Estructuración y renderizado visual del componente UI
              return (
                <TableRow
                  key={row.id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRowClick(row.id)}
                >
                  <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        src={row.identification.image128}
                        alt={row.identification.symbol}
                        sx={{ bgcolor: 'rgba(0, 243, 255, 0.1)', width: 32, height: 32 }}
                      >
                        <Activity size={18} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {row.identification.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.identification.symbol}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                    ${row.financial.price}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}
                      sx={{ color: row.financial.change24h >= 0 ? '#00ff88' : '#ff0055' }}
                    >
                      {row.financial.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <Typography variant="body2" fontWeight="bold">
                        {Math.abs(row.financial.change24h)}%
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>
                    {row.financial.marketCap || 'N/A'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>
                    {row.financial.volume || 'N/A'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>
                    {row.financial.supply ? `${row.financial.supply} ${row.identification.symbol}` : 'N/A'}
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/economia-real/${row.id}`);
                        }}
                      >
                        Comprar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/economia-real/${row.id}`);
                        }}
                      >
                        Vender
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': { color: 'white' },
            '& .Mui-selected': { bgcolor: 'rgba(0, 243, 255, 0.2)' }
          }}
        />
      </Stack>
    </Box>
  );
};
