"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Leaf,
  Users,
  FlaskConical,
  Info
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import api, { hadesApi } from "../../../lib/api";
import { TechFrame } from "../../../components/ui/TechFrame";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";
import { Tooltip } from "../../../components/ui/Tooltip";
import { StationToast } from "../../../components/core_modules/StationToast";

interface MarketListing {
  listingId: string;
  sellerId: string;
  moduleData: {
    type: string;
    currentLevel: number;
    stats: {
      radiationResistance: number;
      baseVitality: number;
    };
    shapeType?: string;
  };
  price: number;
  description?: string;
}

export default function ComprarModulosPage() {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchListings = async () => {
      try {
        const res = await hadesApi.get('/market/listings');
        setListings(res.data.listings || []);
      } catch (error: any) {
        console.error("Error fetching listings:", error);
        setErrorMsg("Error de conexión con el mercado galáctico.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    if (!errorMsg) return;
    const timeout = setTimeout(() => setErrorMsg(null), 6000);
    return () => clearTimeout(timeout);
  }, [errorMsg]);

  const handleBuy = async (listingId: string) => {
    setBuyingId(listingId);
    try {
      // Phase 1: Purchase logic (Backend handles inventory creation)
      await hadesApi.post('/confirmBuyTransaction', { listingId });
      setErrorMsg(null);
      setToast({
        message: "Estructura Forjada con Éxito - Lista en Almacén",
        type: 'success'
      });
      setListings(prev => prev.filter(l => l.listingId !== listingId));
    } catch (error: any) {
      console.error("Error buying module:", error);
      setErrorMsg("No se pudo completar la compra. Revisa tu conexión o saldo.");
      setToast({
        message: "Fallo en la forja de estructura. Verifique recursos.",
        type: 'error'
      });
    } finally {
      setBuyingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'energy': return <Zap size={30} color="#FF2200" />;
      case 'bio': return <Leaf size={30} color="#22FF44" />;
      case 'habitat': return <Users size={30} color="#C0C0C0" />;
      case 'science': return <FlaskConical size={30} color="#0055FF" />;
      default: return <ShoppingCart size={30} color="#00f3ff" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'energy': return '#FF2200';
      case 'bio': return '#22FF44';
      case 'habitat': return '#C0C0C0';
      case 'science': return '#0055FF';
      default: return '#00f3ff';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center bg-[#05050c] pt-[120px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00f3ff]/20 border-t-[#00f3ff]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050c] pb-20 pt-[120px]">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <Link href="/galactic-market">
            <button className="rounded p-2 text-white hover:bg-white/10">
              <ArrowLeft />
            </button>
          </Link>
          <Typography variant="h3" className="font-bold text-white">
            GALACTIC <span style={{ color: '#00f3ff' }}>SHOP</span>
          </Typography>
        </div>

        {listings.length === 0 ? (
          <div className="py-20 text-center">
            <Typography variant="h5" className="text-white/40">
              No hay módulos disponibles en el mercado actualmente.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.listingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TechFrame color={getColor(listing.moduleData?.type || '')}>
                  <div className="p-6">
                    <div className="mb-4 flex justify-between">
                      {getIcon(listing.moduleData?.type || '')}
                      <Chip label={`${listing.price || 0} THAO`} />
                    </div>

                    <Typography variant="h6" className="mb-2 font-bold text-white">
                      {(listing.moduleData?.type || 'unknown').toUpperCase()}
                    </Typography>
                    <Typography variant="body2" className="mb-6 h-[60px] overflow-hidden text-white/60">
                      {listing.description || `Módulo de tipo ${listing.moduleData?.type || 'estándar'} optimizado para sistemas CORE_MODULES-8.`}
                    </Typography>

                    <div className="flex items-center justify-between">
                      <Tooltip content="Integridad Base">
                        <div className="flex items-center gap-1">
                           <Info size={14} className="text-white/40" />
                           <Typography variant="caption" className="text-white/40">
                             HP: {listing.moduleData?.stats?.baseVitality || 100}%
                           </Typography>
                        </div>
                      </Tooltip>

                      {/* El acento del módulo ya lo lleva el TechFrame; el botón
                          de compra usa el verde semántico como en toda la app. */}
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={buyingId === listing.listingId}
                        onClick={() => handleBuy(listing.listingId)}
                      >
                        {buyingId === listing.listingId ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                        ) : 'COMPRAR'}
                      </Button>
                    </div>
                  </div>
                </TechFrame>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-red-500/30 bg-red-950/95 px-4 py-3 text-sm font-bold text-red-100 shadow-lg"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <StationToast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Internal Chip mock since MUI primary Chip might look too generic here
function Chip({ label }: { label: string }) {
  return (
    <div className={cn('rounded px-3 py-1 text-xs font-bold', 'border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-[#00f3ff]')}>
      {label}
    </div>
  );
}
