import { useState, useEffect } from "react";
import { Package as PackageIcon, Hammer as HammerIcon, Trash2 as Trash2Icon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { StationModule } from "../../lib/types/core_modules";
import api, { hadesApi } from "../../lib/api";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

export function LaboratorioInventory() {
  const [inventory, setInventory] = useState<StationModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [forging, setForging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await hadesApi.get('/user/inventory');
      setInventory(res.data.inventory || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    window.addEventListener('core_modules-inventory-refresh', fetchInventory);
    return () => window.removeEventListener('core_modules-inventory-refresh', fetchInventory);
  }, []);

  useEffect(() => {
    if (!errorMsg) return;
    const timeout = setTimeout(() => setErrorMsg(null), 6000);
    return () => clearTimeout(timeout);
  }, [errorMsg]);

  const handleForge = async () => {
    setForging(true);
    try {
      const types = ["energy", "science", "bio", "habitat"];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const res = await hadesApi.post('/modules', {
        moduleType: randomType,
        shapeType: randomType === "energy" ? "square" : randomType === "science" ? "triangle" : randomType === "bio" ? "circle" : "rectangle"
      });

      if (res.data.module) {
        setInventory(prev => [...prev, res.data.module]);
      }
    } catch (error) {
      console.error("Error forging module:", error);
    } finally {
      setForging(false);
    }
  };

  const handleDelete = async (moduleId: string) => {
    setDeletingId(moduleId);
    try {
      await hadesApi.delete(`/modules/${moduleId}`);
      setInventory(prev => prev.filter(m => m.moduleId !== moduleId));
    } catch (error: any) {
      console.error("Error deleting module:", error);
      const message = error.response?.data?.message || "Error al eliminar el módulo. Puede que esté anclado.";
      setErrorMsg(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#00f3ff]" />
      </div>
    );
  }

  return (
    <div className="relative mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PackageIcon size={20} className="text-[#00f3ff]" />
          <Typography variant="h5" className="font-bold text-white">
            ALMACÉN DE ESTRUCTURAS
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={forging ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : <HammerIcon size={18} />}
          onClick={handleForge}
          disabled={forging}
          sx={{
            bgcolor: '#00f3ff',
            color: '#0a0c10',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#00d8e4' }
          }}
        >
          {forging ? 'FORJANDO...' : 'FORJAR ESTRUCTURA'}
        </Button>
      </div>

      {inventory.length === 0 ? (
        <div className="rounded-paper border border-dashed border-[#00f3ff]/20 bg-white/[0.02] p-8 text-center">
          <Typography component="p" className="text-white/50">
            No hay estructuras en el almacén. Utiliza la forja para crear una o adquiere módulos en el Mercado Galáctico.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {inventory.map((mod) => (
            <motion.div key={mod.moduleId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative rounded-lg border border-[#00f3ff]/20 bg-[rgba(10,12,16,0.8)] p-4 transition-colors hover:border-[#00f3ff]">
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="overline" className="font-bold text-[#00f3ff]">
                      {mod.moduleType.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" className="font-mono text-white">
                      ID: {mod.moduleId.slice(0, 8)}
                    </Typography>
                  </div>
                  <button
                    disabled={deletingId === mod.moduleId}
                    onClick={() => handleDelete(mod.moduleId)}
                    className="rounded p-1 text-white/30 hover:text-[#ff3366]"
                  >
                    {deletingId === mod.moduleId ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                    ) : (
                      <Trash2Icon size={16} />
                    )}
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex items-center rounded-full border border-[#00f3ff]/20 bg-[#00f3ff]/10 px-2.5 py-0.5 text-xs text-[#00f3ff]">
                    HP: {mod.baseVitality}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white">
                    {mod.shapeType || 'Standard'}
                  </span>
                </div>
              </div>
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
            className="fixed bottom-6 right-6 z-50 rounded-lg border border-red-500/30 bg-red-950/90 px-4 py-3 text-sm text-red-200 shadow-lg"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
