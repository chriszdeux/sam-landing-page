"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('lyncore_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // LocalStorage not accessible
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('lyncore_cookie_consent', 'accepted');
      window.dispatchEvent(new Event('cookie_consent_updated'));
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('lyncore_cookie_consent', 'declined');
      window.dispatchEvent(new Event('cookie_consent_updated'));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 text-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl" role="img" aria-label="Cookies">🍪</span>
        <div>
          <h3 className="font-semibold text-white text-sm">Privacidad y Cookies en Lyncore</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Utilizamos cookies técnicas y analíticas anónimas para optimizar tu experiencia y la velocidad del simulador galáctico. Puedes consultar nuestra{' '}
            <Link href="/privacidad" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
              Política de Privacidad
            </Link>.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={handleDecline}
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 transition-colors"
        >
          Solo esenciales
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          Aceptar todas
        </button>
      </div>
    </aside>
  );
}
