// 1-Definir componente modal y sus estilos
// 2-Obtener estado y despachador del modal
// 3-Renderizar contenido dinámico según tipo
// 4-Renderizar estructura del modal con transición

//# 1-Definir componente modal y sus estilos
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Dialog } from './Dialog';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { closeModal } from '../../lib/features/uiSlice';
import { AuthModal } from '../auth/AuthModal';
import { ValidateAccountForm } from '../auth/ValidateAccountForm';
import { RewardsModal } from '../rewards/RewardsModal';

export const Modal = ({ children }: { children?: React.ReactNode }) => {

  //# 2-Obtener estado y despachador del modal
  const dispatch = useAppDispatch();
  const { isModalOpen, activeModalContent } = useAppSelector((state) => state.ui);

  const isAuthModal = ['login', 'register'].includes(activeModalContent || '');

  //# 3-Renderizar contenido dinámico según tipo
  const renderContent = () => {
    switch (activeModalContent) {
      case 'login':
        return <AuthModal initialMode="login" />;
      case 'register':
        return <AuthModal initialMode="register" />;
      case 'validate':
        return <ValidateAccountForm />;
      case 'rewards':
        return <RewardsModal />;
      default:
        return children;
    }
  };

  //# 4-Renderizar estructura del modal con transición
  return (
    <Dialog
      open={isModalOpen}
      onClose={() => dispatch(closeModal())}
      className={cn(
        'relative max-h-[90vh] overflow-y-auto rounded-2xl border border-[#00f3ff]/30 bg-[rgba(10,15,30,0.95)] shadow-[0_0_30px_rgba(0,243,255,0.2),inset_0_0_20px_rgba(0,243,255,0.05)] outline-none backdrop-blur-xl',
        isAuthModal ? 'max-w-[900px] p-0' : 'max-w-[500px] p-8'
      )}
    >
      <button
        onClick={() => dispatch(closeModal())}
        className="absolute right-2 top-2 z-10 rounded-full p-1 text-foreground-muted transition-colors hover:text-primary"
      >
        <X size={20} />
      </button>
      {renderContent()}
    </Dialog>
  );
};
