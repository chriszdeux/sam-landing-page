// 1-Estructuración y renderizado visual del componente UI
// 2-Estructuración y renderizado visual del componente UI

'use client';

import React, { use } from 'react';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { Background } from '../../../components/layout/Background';
import { Card } from '../../../components/ui/Card';
import { newsData } from '../../../lib/data/news';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const article = newsData.find(n => n.slug === slug);

    if (!article) {

        //# 1-Estructuración y renderizado visual del componente UI
        return <div className="pt-40 text-center text-white">Articulo no encontrado</div>;
    }


  //# 2-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
        <Background />

        <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-4 pt-32 pb-20 sm:px-6 lg:px-8">
            <Link href="/news">
                <Button startIcon={<ArrowLeft size={18} />} sx={{ color: 'white', mb: 4 }}>
                    Volver a Noticias
                </Button>
            </Link>

            <Card sx={{ p: { xs: 3, md: 6 } }} hoverEffect={false}>
                <div className="mb-8 h-[400px] w-full overflow-hidden rounded border border-white/10">
                    <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div className="mb-6 flex items-center gap-4">
                    <Typography className="rounded-[1px] border border-[#00f3ff]/30 bg-[#00f3ff]/10 px-3 py-1 text-[0.875rem] font-bold text-primary">
                        {article.category}
                    </Typography>
                    <Typography className="text-foreground-muted">
                        {article.date}
                    </Typography>
                </div>

                <Typography variant="h2" className="mb-4 font-bold text-white">
                    {article.title}
                </Typography>

                <Typography variant="subtitle1" className="mb-8 flex items-center gap-2 italic text-primary">
                     By {article.author}
                </Typography>

                <div
                    className="text-foreground-muted [&_p]:mb-4 [&_p]:leading-[1.8] [&_p]:text-[1.1rem] [&_strong]:text-white"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </Card>
        </div>
    </div>
  );
}
