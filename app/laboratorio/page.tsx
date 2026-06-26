'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LaboratorioPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/operaciones');
    }, [router]);

    return null;
}
