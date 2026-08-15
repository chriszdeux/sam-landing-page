// 1-Estructuración y renderizado visual del componente UI
// 2-Estructuración y renderizado visual del componente UI

'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Typography } from '../../../components/ui/Typography';
import { mechanicsData } from '../../../lib/data/mechanics';
import { Button } from '../../../components/ui/Button';
import { LayoutType1, LayoutType2, LayoutType3, LayoutType4, LayoutTypeDefense } from '../../../components/mechanics/MechanicLayouts';

export default function MechanicPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const mechanic = mechanicsData.find(m => m.slug === slug);

  if (!mechanic) {
    
    
    //# 1-Estructuración y renderizado visual del componente UI
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography>Mecánica no encontrada</Typography>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  const renderLayout = () => {
      switch(mechanic.layoutType) {
          case 'type2': return <LayoutType2 mechanic={mechanic} />;
          case 'type3': return <LayoutType3 mechanic={mechanic} />;
          case 'type4': return <LayoutType4 mechanic={mechanic} />;
          case 'defense': return <LayoutTypeDefense mechanic={mechanic} />;
          default: return <LayoutType1 mechanic={mechanic} />;
      }
  };

  
  
  //# 2-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed top-[100px] left-[20px] z-[100] md:left-[40px]">
        <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => router.back()}
            sx={{ backdropFilter: 'blur(5px)' }}
        >
            Atrás
        </Button>
      </div>

      {renderLayout()}
    </div>
  );
}
