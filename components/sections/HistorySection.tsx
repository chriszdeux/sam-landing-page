// 1-Estructuración y renderizado visual del componente UI
// 2-Estructuración y renderizado visual del componente UI

'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { historyData } from '../../lib/data/history';
import { EnvVariables } from '@/lib/constants/variables';
import { CinematicStoryteller } from '../ui/CinematicStoryteller';

gsap.registerPlugin(ScrollTrigger);

const TechFrame = ({ children, color = '#ff0055' }: { children: React.ReactNode; color?: string }) => (
  <div
    className="relative p-1"
    style={{
      background: `linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%)`,
      filter: `drop-shadow(0 0 5px ${color}80)`,
    }}
  >
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        border: `1px solid ${color}40`,
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)',
      }}
    />
    <div
      className="relative bg-black/70"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full"
        style={{
          background: `linear-gradient(to bottom, transparent 50%, ${color}10 50%)`,
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  </div>
);

const DataLog = ({ title, year, children, align = 'left' }: { title: string; year?: string; children: React.ReactNode; align?: 'left' | 'right' }) => (
  <div
    className={cn(
      'relative p-4 backdrop-blur-[5px] md:p-8',
      align === 'left' ? 'border-l-2 border-[#ff0055] text-left' : 'border-r-2 border-[#00f3ff] text-right'
    )}
    style={{ background: 'linear-gradient(90deg, rgba(255, 0, 85, 0.05) 0%, rgba(0,0,0,0) 100%)' }}
  >
    <Typography variant="overline" className="mb-2 block font-mono tracking-[2px] text-[#b3b3b3]">
      {'// ARCHIVE RECORD: '}{year || 'UNKNOWN'}
    </Typography>
    <Typography variant="h3" className="mb-6 text-[1.8rem] font-bold uppercase text-white [text-shadow:0_0_10px_rgba(255,0,85,0.5)] md:text-[2.5rem]">
      {title}
    </Typography>
    <Typography component="div" variant="body1" className="font-mono text-[1.1rem] leading-[1.8] text-[gray]">
      {children}
    </Typography>
  </div>
);

export const HistorySection = () => {
  const [isCinematicOpen, setIsCinematicOpen] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
  const { project } = EnvVariables;

  useGSAP(() => {
    gsap.from('.history-main-title', {
      scrollTrigger: {
        trigger: '.history-main-title',
        start: 'top 80%',
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    const headers = gsap.utils.toArray<HTMLElement>('.history-year-header');
    headers.forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    const textBlocks = gsap.utils.toArray<HTMLElement>('.history-text-block');
    textBlocks.forEach((block) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    const imageBlocks = gsap.utils.toArray<HTMLElement>('.history-image-block');
    imageBlocks.forEach((block) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
        },
        x: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

  }, { scope: container });



  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <Section id="history" className="overflow-hidden">
      <div ref={container}>
        <div className="history-main-title mb-24">
          <Typography
            variant="h2"
            component="h2"
            className="mb-2 text-center font-black uppercase text-white"
            style={{ textShadow: '0 0 20px rgba(0, 243, 255, 0.8)' }}
          >
            Cronología {project}
          </Typography>
          <div className="mb-4 flex justify-center">
            <Button
              variant="contained"
              startIcon={<Play />}
              onClick={() => setIsCinematicOpen(true)}
              sx={{
                background: 'rgba(0, 243, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 243, 255, 0.5)',
                color: '#fff',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: 2,
                px: 4,
                py: 1.5,
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.15)',
                '&:hover': {
                    background: 'rgba(0, 243, 255, 0.15)',
                    boxShadow: '0 0 30px rgba(0, 243, 255, 0.4)',
                    transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Reproducir Historia
            </Button>
          </div>
          <hr className="my-8 mx-auto max-w-[200px] border-t opacity-30" style={{ borderColor: '#00f3ff' }} />
        </div>

        <div className="flex flex-col gap-40">
          {historyData.map((eventData, yearIndex) => (
            <div key={eventData.year}>

              <div className="history-year-header mb-20 text-center">
                  <Typography variant="overline" className="mb-4 block text-[1.2rem] tracking-[8px] text-[#ffb700]">
                      AÑO
                  </Typography>
                  <Typography variant="h3" className="mb-6 text-[1.8rem] font-bold uppercase text-white hyphens-auto break-words md:text-[4rem]">
                      {eventData.title}
                  </Typography>
                  <Typography variant="h5" className="mx-auto max-w-[800px] font-mono leading-[1.6] text-[#b3b3b3]">
                      {eventData.description}
                  </Typography>
              </div>

                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 md:gap-16">
                  {eventData.details.map((detail, index) => {
                      const isEven = index % 2 === 0;



                      //# 2-Estructuración y renderizado visual del componente UI
                      return (
                          <React.Fragment key={`${eventData.year}-${index}`}>

                              <div
                                className={cn(
                                  'history-text-block md:col-span-6',
                                  isEven ? 'order-2 md:order-1' : 'order-2 md:order-2'
                                )}
                              >
                                  <DataLog
                                      title={detail.heading}
                                      year={`${eventData.year}.${index + 1}`}
                                      align={isEven ? 'left' : 'right'}
                                  >
                                      {detail.paragraphs.map((p, i) => (
                                          <p key={i} style={{ marginBottom: i < detail.paragraphs.length - 1 ? '1em' : 0 }}>
                                              {p}
                                          </p>
                                      ))}
                                  </DataLog>
                              </div>

                              <div
                                className={cn(
                                  'history-image-block md:col-span-6',
                                  isEven ? 'order-1 md:order-2' : 'order-1 md:order-1'
                                )}
                              >
                                  <TechFrame color={isEven ? '#00f3ff' : '#ffb700'}>
                                      <div className="glitch-effect relative h-[300px] w-full overflow-hidden md:h-[400px]">
                                          {detail.image ? (
                                              <Image
                                                  src={detail.image}
                                                  alt={detail.imageCaption}
                                                  fill
                                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                  className="holo-image"
                                                  style={{
                                                      objectFit: 'cover',
                                                      animationDelay: `${((yearIndex * 5 + index) * 0.7) % 5}s`
                                                  }}
                                              />
                                          ) : (
                                              <div
                                                className="flex h-full w-full items-center justify-center"
                                                style={{ background: `radial-gradient(circle at center, ${isEven ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 183, 0, 0.1)'} 0%, transparent 70%)` }}
                                              >
                                                  <Typography className="p-4 text-center italic text-white/50">
                                                      [IMAGEN NO DISPONIBLE: {detail.imageCaption}]
                                                  </Typography>
                                              </div>
                                          )}

                                          <div className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-black/90 to-transparent p-4 font-mono text-[0.8rem] text-white/80">
                                              IMG_REF: {detail.imageCaption}
                                          </div>
                                      </div>
                                  </TechFrame>
                              </div>
                          </React.Fragment>
                      );
                  })}
              </div>

              {yearIndex < historyData.length - 1 && (
                   <hr className="mt-32 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <CinematicStoryteller
        data={historyData}
        isOpen={isCinematicOpen}
        onClose={() => setIsCinematicOpen(false)}
      />
    </Section>
  );
};
