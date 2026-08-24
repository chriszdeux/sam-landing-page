'use client';

import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { EnvVariables } from '@/lib/constants/variables';
import { Typography } from '../ui/Typography';

export const Footer = () => {
  return (
    <footer
      className="relative border-t border-[#00f3ff]/10 bg-[#04040a] py-16 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-[#00f3ff] before:to-transparent before:opacity-50 before:content-['']"
    >
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12">
          {/* Logo & Description */}
          <div className="sm:col-span-2 md:col-span-5">
            <Typography
              variant="h5"
              className="mb-1 font-black tracking-[2px] text-[#00f3ff] [text-shadow:0_0_15px_rgba(0,243,255,0.3)]"
            >
              {EnvVariables.project.toUpperCase()}
            </Typography>
            <Typography variant="body2" className="leading-[1.8] text-white/60 md:pr-10">
              Soberanía criptográfica e infraestructura de supervivencia en el yermo galáctico.
              El ledger de sedimento inmutable para una civilización descentralizada y libre del control fiat.
            </Typography>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 md:col-span-3">
            <Typography variant="subtitle1" className="mb-4 font-bold tracking-[1px] text-white">
              Protocolos Rápidos
            </Typography>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Inicio', path: '/' },
                { name: '¿Qué es Lyncore?', path: '/que-es-lyncore' },
                { name: 'Historia', path: '/history' },
                { name: 'Operaciones', path: '/operaciones' }
              ].map((link) => (
                <Link key={link.name} href={link.path} className="no-underline">
                  <Typography
                    variant="body2"
                    className="cursor-pointer text-white/50 transition-colors duration-200 hover:text-[#00f3ff]"
                  >
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </div>
          </div>

          {/* Status & Socials */}
          <div className="sm:col-span-1 md:col-span-4">
            <Typography variant="subtitle1" className="mb-4 font-bold tracking-[1px] text-white">
              Soporte de Flota
            </Typography>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]" />
                <Typography variant="caption" className="font-bold tracking-[1.5px] text-[#00ff88]">
                  LEDGER: CONECTADO
                </Typography>
              </div>
              <div className="flex flex-row gap-3">
                {[
                  { icon: <Twitter size={20} />, label: 'Twitter', color: '#00f3ff' },
                  { icon: <Github size={20} />, label: 'GitHub', color: '#ffffff' },
                  { icon: <Linkedin size={20} />, label: 'LinkedIn', color: '#0a66c2' }
                ].map((social, index) => (
                  <button
                    key={index}
                    aria-label={social.label}
                    className="rounded-full border border-white/10 p-2 text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.02]"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = social.color;
                      e.currentTarget.style.borderColor = social.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '';
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8 text-center">
          <Typography variant="body2" className="text-white/40">
            © {new Date().getFullYear()} Lyncore Protocol. Todos los derechos reservados bajo la regla del ledger.
          </Typography>
          <Typography variant="caption" className="font-mono text-white/20">
            v0.2.0-apocalypse
          </Typography>
        </div>
      </div>
    </footer>
  );
};
