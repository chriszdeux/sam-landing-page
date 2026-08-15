// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import Link from 'next/link';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import Image from 'next/image';
import { Background } from '../../components/layout/Background';
import { PageHeader } from '../../components/ui/PageHeader';
import { newsData } from '../../lib/data/news';
import { TechFrame } from '../../components/ui/TechFrame';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight } from 'lucide-react';

export default function NewsPage() {


  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-[1] mx-auto w-full max-w-[1536px] px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <PageHeader
            title="Noticias Galácticas"
            subtitle="Mantente informado sobre los últimos acontecimientos en el sistema solar."
            color="#00f3ff"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {newsData.map((news, index) => (
            <div className={index === 0 ? 'md:col-span-12' : 'md:col-span-4'} key={news.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                  <Link href={`/news/${news.slug}`} className="no-underline">
                    <TechFrame
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: index === 0 ? { xs: 'column', md: 'row' } : 'column',
                            p: 0,
                            '&:hover': {
                                '& .news-image-container': {
                                    transform: 'scale(1.05)'
                                }
                            }
                        }}
                    >
                        <div className={index === 0 ? 'relative h-[300px] w-full flex-shrink-0 overflow-hidden md:h-auto md:w-[60%]' : 'relative h-[250px] w-full flex-shrink-0 overflow-hidden'}>
                             <div
                                className="news-image-container relative h-full w-full transition-transform duration-500"
                             >
                                <Image
                                    src={news.image}
                                    alt={news.title}
                                    fill
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                />
                             </div>
                            <div className="absolute top-4 left-4 z-[2]">
                                <span className="rounded-full border border-[#00f3ff]/30 bg-black/70 px-2 py-0.5 text-xs font-bold text-primary backdrop-blur-sm">
                                    {news.category}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center p-8">
                            <div className="mb-4 flex gap-4 text-[0.8rem] text-foreground-muted">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} /> {news.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={16} /> {news.author}
                                </div>
                            </div>

                            <Typography
                                variant={index === 0 ? 'h3' : 'h5'}
                                className="mb-4 break-words font-bold text-white bg-gradient-to-br from-white to-[#aaaaaa] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [hyphens:auto]"
                            >
                                {news.title}
                            </Typography>

                            <Typography variant="body1" className="mb-6 grow text-foreground-muted">
                                {news.excerpt}
                            </Typography>

                            <div>
                                <Button
                                    endIcon={<ArrowRight size={18} />}
                                    sx={{
                                        color: 'primary.main',
                                        pl: 0,
                                        '&:hover': { bg: 'transparent', textDecoration: 'underline' }
                                    }}
                                >
                                    Leer Artículo
                                </Button>
                            </div>
                        </div>
                    </TechFrame>
                  </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
