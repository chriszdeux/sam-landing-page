// 1-Definir componente de noticias de criptomonedas
// 2-Renderizar lista de noticias

//# 1-Definir componente de noticias de criptomonedas
'use client';

import React from 'react';
import { Typography } from '../ui/Typography';
import { Newspaper } from 'lucide-react';
import { Card } from '../ui/Card';

const newsItems = [
    { id: 1, title: 'Crypto Market Hits New Highs', summary: 'Global adoption drives prices up as major institutions invest heavily.', date: '2h ago' },
    { id: 2, title: 'New Regulation Announced', summary: 'Government bodies release guidelines for digital asset taxation.', date: '5h ago' },
    { id: 3, title: 'Tech Giant Accepts Crypto', summary: 'A leading tech company now accepts digital currency for payments.', date: '1d ago' },
];

export const CryptoNews = ({ name }: { name: string }) => {

  //# 2-Renderizar lista de noticias
  return (
    <div>
        <Typography variant="h6" className="mb-4 flex items-center gap-2 text-foreground-muted">
            <Newspaper size={18} /> Noticias sobre {name}
        </Typography>
        <div className="flex flex-col gap-4">
            {newsItems.map((item) => (
                <Card key={item.id} sx={{ color: '#fff' }}>
                    <div className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <Typography variant="subtitle1" className="font-bold text-primary">
                                {item.title}
                            </Typography>
                            <Typography variant="caption" className="text-foreground-muted">
                                {item.date}
                            </Typography>
                        </div>
                        <Typography variant="body2" className="mt-2 text-foreground-muted">
                            {item.summary}
                        </Typography>
                    </div>
                </Card>
            ))}
        </div>

    </div>
  );
};
