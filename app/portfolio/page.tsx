'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Background } from '../../components/layout/Background';
import { Typography } from '../../components/ui/Typography';

export default function PortfolioRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center">
            <Background />
            <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10" style={{ borderTopColor: '#00f3ff' }} />
                <Typography variant="body1" className="tracking-[2px] text-white/50">
                    REDIRECCIONANDO AL CENTRO DE OPERACIONES...
                </Typography>
            </div>
        </main>
    );
}
