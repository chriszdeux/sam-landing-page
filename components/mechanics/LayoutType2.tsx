// 1-Rastreo de elemento seleccionado para selected feature
// 2-Estructuración y renderizado visual del componente UI
// 3-Estructuración y renderizado visual del componente UI

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Info } from 'lucide-react';
import { Mechanic } from '../../lib/data/mechanics';
import { FeatureModal } from './FeatureModal';
import { Typography } from '../ui/Typography';

import { AnimationRegistry } from './AnimationRegistry';

export const LayoutType2 = ({ mechanic }: { mechanic: Mechanic }) => {

    //# 1-Rastreo de elemento seleccionado para selected feature
    const [selectedFeature, setSelectedFeature] = useState<{title: string, description: string, modalContent?: string, modalImage?: string} | null>(null);

    const renderAnimation = (animationType?: string) => {
        if (!animationType) return null;
        const AnimationComponent = AnimationRegistry[animationType];
        if (!AnimationComponent) return null;

        //# 2-Estructuración y renderizado visual del componente UI
        return <AnimationComponent color={mechanic.color} />;
    };

    //# 3-Estructuración y renderizado visual del componente UI
    return (
    <div>
        <FeatureModal
            open={!!selectedFeature}
            onClose={() => setSelectedFeature(null)}
            title={selectedFeature?.title || ''}
            description={selectedFeature?.description || ''}
            content={selectedFeature?.modalContent}
            image={selectedFeature?.modalImage}
            color={mechanic.color}
        />
        <div className="relative flex h-[60vh] items-center justify-center overflow-hidden bg-black">
            {renderAnimation(mechanic.backgroundAnimation)}

            <div
                className="absolute z-[1] h-[120%] w-[120%]"
                style={{
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, ${mechanic.color}20 0%, transparent 70%)`,
                }}
            />
             <div className="relative z-10 mx-auto w-full max-w-[900px] px-4 text-center sm:px-6">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <mechanic.icon size={64} color={mechanic.color} style={{ marginBottom: 20 }} />
                    <Typography variant="h1" className="font-black uppercase tracking-[-2px]">
                        {mechanic.title}
                    </Typography>
                    <Typography variant="h5" component="p" className="mt-4 font-mono text-foreground-muted">
                         {mechanic.content.statLabel}: <span style={{ color: mechanic.color }}>{mechanic.content.statValue}</span>
                    </Typography>
                </motion.div>
            </div>
        </div>

        <div className="relative z-20 mx-auto -mt-20 mb-20 w-full max-w-[1200px] px-4 sm:px-6">
            <div className="rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 md:p-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    <div className="md:col-span-8">
                         <Typography variant="h4" component="p" className="mb-2" style={{ color: mechanic.color }}>{mechanic.content.heading}</Typography>
                         {mechanic.content.paragraphs.map((p: string, i: number) => (
                             <Typography key={i} component="p" className="mb-6 text-[1.1rem] text-foreground-muted">
                                 {p}
                             </Typography>
                         ))}
                    </div>
                    <div className="md:col-span-4">
                        <div className="rounded-2xl bg-white/[0.03] p-8">
                            <Typography variant="h6" component="p" className="mb-2 flex items-center gap-2"><TrendingUp size={20} className="align-middle" /> Highlights</Typography>
                            <div className="mt-6 flex flex-col gap-4">
                                {mechanic.content.features.map((f, i) => (
                                    <div
                                        key={i}
                                        onClick={() => mechanic.id === 'combat' ? setSelectedFeature(f) : undefined}
                                        className={`flex flex-col gap-2 ${mechanic.id === 'combat' ? 'hover:opacity-80' : ''}`}
                                        style={{
                                            cursor: mechanic.id === 'combat' ? 'pointer' : 'default',
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <CheckCircle size={20} style={{ color: mechanic.color }} />
                                            <Typography variant="body1" component="p" className="font-bold">
                                                {f.title}
                                                {mechanic.id === 'combat' && <Info size={16} className="ml-2 inline text-foreground-muted" />}
                                            </Typography>
                                        </div>
                                        {}
                                        {mechanic.id !== 'combat' && (
                                            <Typography variant="body2" component="p" className="ml-8 text-gray-400">
                                                {f.description}
                                            </Typography>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};
