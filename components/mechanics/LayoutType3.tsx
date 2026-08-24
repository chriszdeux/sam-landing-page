// 1-Estructuración y renderizado visual del componente UI
// 2-Estructuración y renderizado visual del componente UI

import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Mechanic } from '../../lib/data/mechanics';
import { AnimationRegistry } from './AnimationRegistry';
import { Typography } from '../ui/Typography';
import { cn } from '@/lib/utils/cn';

export const LayoutType3 = ({ mechanic }: { mechanic: Mechanic }) => {

    const renderAnimation = (animationType?: string) => {
        if (!animationType) return null;
        const AnimationComponent = AnimationRegistry[animationType];
        if (!AnimationComponent) return null;

        //# 1-Estructuración y renderizado visual del componente UI
        return <AnimationComponent color={mechanic.color} />;
    };

    //# 2-Estructuración y renderizado visual del componente UI
    return (
    <div className="relative min-h-screen w-full">
        {}
        {mechanic.backgroundImage && (
            <div
                className="fixed z-0"
                style={{
                    inset: -20,
                    backgroundImage: `url(${mechanic.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px) contrast(1.1) brightness(0.6)',
                }}
            />
        )}

        {}
        {mechanic.backgroundImage && (
            <div
                className="fixed inset-0 z-0"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)' }}
            />
        )}

    <div className="relative z-[1] mx-auto w-full max-w-[1536px] px-4 pb-20 pt-[200px] sm:px-6 lg:px-8">

        {}
        <div className="mb-[120px] text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h6" component="p" className="mb-2 tracking-[4px]" style={{ color: mechanic.color }}>MÓDULO DE GESTIÓN</Typography>
                <Typography variant="h1" className="mb-8 font-black uppercase">{mechanic.title}</Typography>
                <div className="mx-auto mb-12 h-1 w-[100px] rounded-lg" style={{ backgroundColor: mechanic.color }} />

                <div className="mx-auto w-full max-w-[900px]">
                    <Typography variant="h5" component="p" className="mx-auto leading-[1.6] text-foreground-muted">
                        {mechanic.content.heading}
                    </Typography>
                </div>
            </motion.div>
        </div>

        {}
        <div className="mb-40 grid grid-cols-1 gap-8 md:grid-cols-12">
            {mechanic.content.paragraphs.map((p: string, i: number) => (
                <div className="md:col-span-4" key={i}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <div
                            className="h-full p-8"
                            style={{
                                borderTop: `2px solid ${mechanic.color}40`,
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                            }}
                        >
                             <Typography component="p" className="text-[1.1rem] leading-[1.8] text-foreground-muted">{p}</Typography>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>

        {}
        <div className="flex flex-col gap-40">
            {mechanic.content.features.map((f, i) => (
                <div className={cn('flex flex-col items-center gap-16 md:flex-row', i % 2 !== 0 && 'md:flex-row-reverse')} key={i}>
                    {}
                    <div className="w-full md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div
                                className="relative overflow-hidden rounded-[32px]"
                                style={{
                                    border: `1px solid ${mechanic.color}30`,
                                    boxShadow: `0 20px 50px ${mechanic.color}10`,
                                }}
                            >
                                {}
                                {f.modalImage ? (
                                    <div className="relative h-[500px] w-full overflow-hidden">
                                        <motion.img
                                            src={f.modalImage}
                                            alt={f.title}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1.2, x: [0, -10, 0], y: [0, -5, 0] }}
                                            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #000 0%, transparent 50%)` }} />
                                    </div>
                                ) : (f.animationType ? (
                                    <div className="h-[500px] w-full overflow-hidden">
                                        {renderAnimation(f.animationType)}
                                    </div>
                                ) : (
                                    <div className="flex h-[500px] items-center justify-center" style={{ backgroundColor: `${mechanic.color}10` }}>
                                        <Settings size={100} style={{ color: mechanic.color }} className="opacity-50" />
                                    </div>
                                ))}

                                {}
                                <Typography
                                    component="p"
                                    className="absolute left-5 top-5 text-[8rem] font-black leading-none text-white opacity-10"
                                >
                                    0{i + 1}
                                </Typography>
                            </div>
                        </motion.div>
                    </div>

                    {}
                    <div className="w-full md:w-1/2">
                        <motion.div
                             initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                             whileInView={{ opacity: 1, x: 0 }}
                             viewport={{ once: true }}
                             transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div>
                                <Typography variant="overline" component="p" className="font-bold tracking-[2px]" style={{ color: mechanic.color }}>SISTEMA {i + 1}</Typography>
                                <Typography variant="h3" component="p" className="mb-8 mt-2 font-bold">{f.title}</Typography>

                                {f.modalContent ? (
                                    f.modalContent.split('\n\n').map((paragraph, idx) => (
                                        <Typography key={idx} component="p" className="mb-6 text-[1.2rem] leading-[1.8] text-foreground-muted">
                                            {paragraph}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography component="p" className="text-[1.2rem] leading-[1.8] text-foreground-muted">
                                        {f.description}
                                    </Typography>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>

    </div>
    </div>
    );
};
