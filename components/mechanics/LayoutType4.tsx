// 1-Estructuración y renderizado visual del componente UI
// 2-Estructuración y renderizado visual del componente UI

import React from 'react';
import { Mechanic } from '../../lib/data/mechanics';
import { AnimationRegistry } from './AnimationRegistry';
import { Typography } from '../ui/Typography';

export const LayoutType4 = ({ mechanic }: { mechanic: Mechanic }) => {

    const renderAnimation = (animationType?: string) => {
        if (!animationType) return null;
        const AnimationComponent = AnimationRegistry[animationType];
        if (!AnimationComponent) return null;

        //# 1-Estructuración y renderizado visual del componente UI
        return <AnimationComponent color={mechanic.color} />;
    };

    //# 2-Estructuración y renderizado visual del componente UI
    return (
    <div className="mx-auto w-full max-w-[1536px] px-4 pb-24 pt-[176px] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12">
             <div className="md:col-span-5">
                 <div
                     className="relative flex h-full min-h-[500px] flex-col justify-center overflow-hidden p-12 text-white"
                     style={{
                         backgroundColor: '#050505',
                         borderRight: `1px solid ${mechanic.color}20`,
                     }}
                 >
                     {mechanic.backgroundImage && (
                        <div
                            className="absolute z-0 opacity-30"
                            style={{
                                inset: -20,
                                backgroundImage: `url(${mechanic.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(4px) contrast(1.1) brightness(0.6)',
                            }}
                        />
                     )}

                     {}
                     <div
                         className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                         style={{ background: `radial-gradient(circle at top right, ${mechanic.color}15, transparent 70%)` }}
                     />

                     <div className="relative z-10">
                         <Typography variant="h2" component="p" className="mb-2 font-bold" style={{ color: mechanic.color }}>{mechanic.title}</Typography>
                         <Typography variant="h6" component="p" className="text-foreground-muted opacity-80">{mechanic.content.statLabel}</Typography>
                         <Typography variant="h3" component="p" className="font-bold">{mechanic.content.statValue}</Typography>
                     </div>
                 </div>
             </div>
             <div className="md:col-span-7">
                 <div className="h-full bg-[#111] p-8 md:p-20">
                     <Typography variant="h4" component="p" className="mb-2 text-foreground">{mechanic.content.heading}</Typography>
                     {mechanic.content.paragraphs.map((p: string, i: number) => (
                         <Typography key={i} component="p" className="mb-6 text-foreground-muted">
                             {p}
                         </Typography>
                     ))}

                     <hr className="my-12 border-t border-white/10" />

                     <Typography variant="h6" component="p" className="mb-6" style={{ color: mechanic.color }}>Tecnologías en Desarrollo</Typography>

                     <style>{`
                         .mechanic-feature-card:hover { border-color: var(--card-color); box-shadow: 0 10px 30px var(--card-shadow); }
                     `}</style>
                     <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                         {mechanic.content.features.map((f, i) => (
                             <div key={i}>
                                 <div
                                     className="mechanic-feature-card h-full overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-[5px]"
                                     style={{
                                         '--card-color': mechanic.color,
                                         '--card-shadow': `${mechanic.color}20`,
                                     } as React.CSSProperties}
                                 >
                                     {f.modalImage ? (
                                         <div className="relative h-[200px] w-full overflow-hidden">
                                             <img
                                                 src={f.modalImage}
                                                 alt={f.title}
                                                 className="h-full w-full object-cover"
                                             />
                                             <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111 0%, transparent 100%)' }} />
                                         </div>
                                     ) : (f.animationType && (
                                         <div className="relative h-[200px] w-full overflow-hidden">
                                             {renderAnimation(f.animationType)}
                                             <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to top, #111 0%, transparent 20%)' }} />
                                         </div>
                                     ))}
                                     <div className="p-6">
                                       <Typography variant="h6" component="p" className="mb-2 font-bold text-white">
                                           {f.title}
                                       </Typography>
                                       <Typography variant="body2" component="p" className="leading-[1.6] text-foreground-muted">
                                           {f.description}
                                       </Typography>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </div>
    </div>
    );
};
