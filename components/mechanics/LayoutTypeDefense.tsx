// 1-Estructuración y renderizado visual del componente UI

import React from 'react';
import { motion } from 'framer-motion';
import { Mechanic } from '../../lib/data/mechanics';
import { DefenseAnimation } from './DefenseAnimation';
import { Typography } from '../ui/Typography';

export const LayoutTypeDefense = ({ mechanic }: { mechanic: Mechanic }) => {

    //# 1-Estructuración y renderizado visual del componente UI
    return (
    <div className="relative min-h-screen w-full bg-[#050000]">
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
        <div
            className="fixed inset-0 z-0"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(20,0,0,0.9) 100%)' }}
        />

    <div className="relative z-[1] mx-auto w-full max-w-[1536px] px-4 pb-20 pt-[200px] sm:px-6 lg:px-8">

        {}
        <div className="mb-[120px] text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h6" component="p" className="mb-2 tracking-[4px]" style={{ color: mechanic.color }}>SISTEMA DE DEFENSA</Typography>
                <Typography variant="h1" className="mb-8 font-black uppercase text-white">{mechanic.title}</Typography>
                <div
                    className="mx-auto mb-12 h-1 w-[100px] rounded-lg"
                    style={{ backgroundColor: mechanic.color, boxShadow: `0 0 20px ${mechanic.color}` }}
                />

                <div className="mx-auto w-full max-w-[900px]">
                    <Typography variant="h5" component="p" className="mx-auto leading-[1.6] text-foreground-muted">
                        {mechanic.content.heading}
                    </Typography>
                </div>
            </motion.div>
        </div>

        {}
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-12">
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
                                background: 'linear-gradient(180deg, rgba(255,50,50,0.05) 0%, transparent 100%)',
                            }}
                        >
                             <Typography component="p" className="text-[1.1rem] leading-[1.8] text-foreground-muted">{p}</Typography>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>

        {}
        <div className="mb-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <Typography variant="overline" component="p" className="mb-4 block text-center tracking-[2px]" style={{ color: mechanic.color }}>
                    VISUALIZACIÓN DE AMENAZAS EN TIEMPO REAL
                </Typography>
                <DefenseAnimation />
            </motion.div>
        </div>

    </div>
    </div>
    );
};
