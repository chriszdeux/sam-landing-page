import React from 'react';
import { CryptoDetailView } from '../../../components/market/CryptoDetailView';

// Use server component for the page entry
export default async function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params in the server component
    const { id } = await params;
    
    // Pass the simple string id to the client component
    return <CryptoDetailView id={id} />;
}
