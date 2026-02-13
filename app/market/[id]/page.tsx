/**
 * Página de Detalle de Criptomoneda
 * Componente de servidor (Server Component)
 * Obtención de parámetros de ruta
 * Renderizado de vista detallada (Cliente)
 */
import React from 'react';
import { CryptoDetailView } from '../../../components/market/CryptoDetailView';

export default async function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    return <CryptoDetailView id={id} />;
}
