'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BlocksModule } from '../../../components/modules/blocks/BlocksModule';
import { Background } from '../../../components/layout/Background';

export default function BlocksPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen relative pb-20">
            <Background />

            <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex flex-row items-center gap-6">
                        <button
                            onClick={() => router.back()}
                            className="rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/5 p-2 text-[#00f3ff] transition-colors hover:bg-[#00f3ff]/10"
                        >
                            <ArrowLeft />
                        </button>
                    </div>
                </div>

                <hr className="mb-8 border-white/5" />

                <BlocksModule />
            </div>
        </main>
    );
}
