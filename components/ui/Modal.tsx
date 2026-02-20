// 1-Definir componente modal y sus estilos
// 2-Obtener estado y despachador del modal
// 3-Renderizar contenido dinámico según tipo
// 4-Renderizar estructura del modal con transición

//# 1-Definir componente modal y sus estilos
'use client';

import React from 'react';
import { Modal as MuiModal, Box, IconButton, Fade, Backdrop } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { closeModal } from '../../lib/features/uiSlice';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';
import { ValidateAccountForm } from '../auth/ValidateAccountForm';
import { RewardsModal } from '../rewards/RewardsModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'rgba(10, 15, 30, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(0, 243, 255, 0.3)',
  boxShadow: '0 0 30px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.05)',
  borderRadius: 4,
  p: 4,
  outline: 'none',
};

export const Modal = ({ children }: { children?: React.ReactNode }) => {
  
  //# 2-Obtener estado y despachador del modal
  const dispatch = useAppDispatch();
  const { isModalOpen, activeModalContent } = useAppSelector((state) => state.ui);

  const isWideModal = ['login', 'register'].includes(activeModalContent || '');

  const dynamicStyle = {
    ...style,
    maxWidth: isWideModal ? 900 : 500,
    p: isWideModal ? 0 : 4,
  };

  //# 3-Renderizar contenido dinámico según tipo
  const renderContent = () => {
    switch (activeModalContent) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
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
    <MuiModal
      open={isModalOpen}
      onClose={() => dispatch(closeModal())}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0, 0, 0, .8)', },
        },
      }}
    >
      <Fade in={isModalOpen}>
        <Box sx={dynamicStyle}>
          <IconButton
            onClick={() => dispatch(closeModal())}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 10,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <CloseIcon />
          </IconButton>
          {renderContent()}
        </Box>
      </Fade>
    </MuiModal>
  );
};
