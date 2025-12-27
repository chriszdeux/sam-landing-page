'use client';

import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Background } from '../../../components/layout/Background';
import { Card } from '../../../components/ui/Card';
import { newsData } from '../../../lib/data/news';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NewsArticlePage() {
    const { slug } = useParams();
    const article = newsData.find(n => n.slug === slug);

    if (!article) {
        return <Box sx={{ color: 'white', pt: 20, textAlign: 'center' }}>Articulo no encontrado</Box>;
    }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <Background />
        
        <Container maxWidth="lg" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
            <Link href="/news">
                <Button startIcon={<ArrowBack />} sx={{ color: 'white', mb: 4 }}>
                    Volver a Noticias
                </Button>
            </Link>

            <Card sx={{ p: { xs: 3, md: 6 } }} hoverEffect={false}>
                <Box sx={{ mb: 4, height: 400, width: '100%', overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                    <Typography sx={{ 
                        color: 'primary.main', 
                        border: '1px solid rgba(0, 243, 255, 0.3)',
                        bgcolor: 'rgba(0, 243, 255, 0.1)',
                        px: 1.5,
                        py: 0.5, 
                        borderRadius: 1, 
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                    }}>
                        {article.category}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {article.date}
                    </Typography>
                </Box>

                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    {article.title}
                </Typography>

                <Typography variant="subtitle1" sx={{ color: 'primary.light', mb: 4, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 1 }}>
                     By {article.author}
                </Typography>

                <Box 
                    sx={{ 
                        color: 'text.secondary', 
                        typography: 'body1', 
                        '& p': { mb: 2, lineHeight: 1.8, fontSize: '1.1rem' },
                        '& strong': { color: 'white' }
                    }}
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                />
            </Card>
        </Container>
    </Box>
  );
}
