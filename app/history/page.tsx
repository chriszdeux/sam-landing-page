'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HistorySection } from '../../components/sections/HistorySection';
import { Background } from '../../components/layout/Background';

export default function HistoryPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen relative pb-20">
            <Background />

            <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
                <div className="mb-8 flex">
                    <button
                        onClick={() => router.push('/')}
                        className="rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/5 p-2 text-[#00f3ff] hover:bg-[#00f3ff]/10"
                    >
                        <ArrowLeft />
                    </button>
                </div>

                <HistorySection />
            </div>
        </main>
    );
}
