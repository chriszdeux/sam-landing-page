// 1-Gestión de estado local para search term
// 2-Estructuración y renderizado visual del componente UI

'use client';

import React, { useState } from 'react';
import { Typography } from '../../components/ui/Typography';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { resourcesData } from '../../lib/data/resources';
import { EnvVariables } from '@/lib/constants/variables';
import { motion } from 'framer-motion';

export default function ResourcesPage() {


  //# 1-Gestión de estado local para search term
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resourcesData.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );



  //# 2-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 pt-40 pb-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PageHeader
                title="Base de Datos de Materiales"
                subtitle={`Catálogo completo de recursos, minerales y tecnologías exóticas disponibles en el universo ${EnvVariables.project}.`}
                color="#00f3ff"
            />
        </motion.div>

        <div className="mx-auto mb-20 max-w-[600px]">
            <Input
                fullWidth
                placeholder="Buscar material por nombre o tipo..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                startAdornment={
                    <span className="flex items-center text-foreground-muted">
                        <Search size={18} />
                    </span>
                }
                sx={{
                    borderRadius: 4,
                    '& .MuiInputBase-input': { color: 'white' },
                }}
            />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {filteredResources.map((resource, index) => (
                <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ height: '100%' }}
                >
                    <TechFrame
                        color={resource.color}
                        className="h-full w-full"
                        sx={{ height: '100%' }}
                    >
                        <div className="relative flex h-full w-full flex-col items-center justify-between p-8 text-center">
                            <div className="glitch-effect relative mb-6 h-[120px] w-[120px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                                <Image
                                    src={resource.image}
                                    alt={resource.name}
                                    fill
                                    style={{
                                        objectFit: 'cover',
                                        opacity: 0.8
                                    }}
                                />
                                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${resource.color}40, transparent)` }} />
                            </div>

                            <div className="flex grow flex-col items-center">
                                <Typography variant="h6" className="z-[2] mb-2 font-bold text-white">
                                    {resource.name}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    className="z-[2] mb-4 rounded border px-2 py-1 text-[0.65rem] uppercase"
                                    style={{ color: resource.color, borderColor: `${resource.color}40` }}
                                >
                                    {resource.type}
                                </Typography>

                                <Typography variant="body2" className="z-[2] mb-4 leading-[1.6] text-foreground-muted">
                                    {resource.description}
                                </Typography>
                            </div>
                        </div>
                    </TechFrame>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
