'use client';

import React from 'react';
import { Box, Typography, Stack, CardContent } from '@mui/material';
import { Newspaper } from '@mui/icons-material';
import { Card } from '../ui/Card';

const newsItems = [
    { id: 1, title: 'Crypto Market Hits New Highs', summary: 'Global adoption drives prices up as major institutions invest heavily.', date: '2h ago' },
    { id: 2, title: 'New Regulation Announced', summary: 'Government bodies release guidelines for digital asset taxation.', date: '5h ago' },
    { id: 3, title: 'Tech Giant Accepts Crypto', summary: 'A leading tech company now accepts digital currency for payments.', date: '1d ago' },
];

export const CryptoNews = ({ name }: { name: string }) => {
  return (
    <Box>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Newspaper fontSize="small" /> Noticias sobre {name}
        </Typography>
        <Stack spacing={2}>
            {newsItems.map((item) => (
                <Card key={item.id} sx={{ color: '#fff' }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {item.date}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {item.summary}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Stack>

    </Box>
  );
};
