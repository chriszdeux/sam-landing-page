// 1-Estructuración y renderizado visual del componente UI

import React from 'react';
import { CryptoDetailView } from '../../../components/market/CryptoDetailView';

export default async function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    
    //# 1-Estructuración y renderizado visual del componente UI
    return <CryptoDetailView id={id} />;
}
