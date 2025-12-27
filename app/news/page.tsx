'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Grid, Container, Chip, Button } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { newsData } from '../../lib/data/news';
import { Card } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { AccessTime, Person, ArrowForward } from '@mui/icons-material';

export default function NewsPage() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="xl" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
        <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ 
                mb: 2, 
                color: 'primary.main',
            }}
        >
          Noticias Galácticas
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 8 }}>
            Mantente informado sobre los últimos acontecimientos en el sistema solar.
        </Typography>

        <Grid container spacing={4}>
          {newsData.map((news, index) => (
            <Grid size={{ xs: 12, md: index === 0 ? 12 : 4 }} key={news.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                  <Link href={`/news/${news.slug}`} style={{ textDecoration: 'none' }}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: index === 0 ? { xs: 'column', md: 'row' } : 'column',
                            overflow: 'hidden',
                            p: 0, // Reset padding for custom layout
                            '&:hover': {
                                '& .news-image': {
                                    transform: 'scale(1.05)'
                                }
                            }
                        }}
                    >
                        <Box sx={{ 
                            position: 'relative', 
                            width: index === 0 ? { xs: '100%', md: '60%' } : '100%',
                            height: index === 0 ? { xs: 300, md: 'auto' } : 250,
                            overflow: 'hidden'
                        }}>
                             <img 
                                src={news.image} 
                                alt={news.title} 
                                className="news-image"
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease' 
                                }} 
                            />
                            <Box sx={{ 
                                position: 'absolute', 
                                top: 16, 
                                left: 16,
                                zIndex: 2 
                            }}>
                                <Chip 
                                    label={news.category} 
                                    size="small"
                                    sx={{ 
                                        bgcolor: 'rgba(0,0,0,0.7)', 
                                        backdropFilter: 'blur(4px)',
                                        color: 'primary.main',
                                        border: '1px solid rgba(0,243,255,0.3)',
                                        fontWeight: 'bold'
                                    }} 
                                />
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            p: 4, 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: index === 0 ? { xs: '100%', md: '40%' } : '100%'
                        }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, color: 'text.secondary', fontSize: '0.8rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTime sx={{ fontSize: 16 }} /> {news.date}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Person sx={{ fontSize: 16 }} /> {news.author}
                                </Box>
                            </Box>

                            <Typography 
                                variant={index === 0 ? 'h3' : 'h5'} 
                                gutterBottom 
                                sx={{ 
                                    color: 'white', 
                                    fontWeight: 'bold',
                                    mb: 2,
                                    background: 'linear-gradient(45deg, #fff, #aaa)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {news.title}
                            </Typography>
                            
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                                {news.excerpt}
                            </Typography>
                            
                            <Box>
                                <Button 
                                    endIcon={<ArrowForward />} 
                                    sx={{ 
                                        color: 'primary.main',
                                        pl: 0,
                                        '&:hover': { bg: 'transparent', textDecoration: 'underline' }
                                    }}
                                >
                                    Leer Artículo
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                  </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
