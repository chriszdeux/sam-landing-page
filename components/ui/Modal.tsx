'use client';

import React from 'react';
import { Modal as MuiModal, Box, IconButton, Fade, Backdrop } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { closeModal } from '../../lib/features/uiSlice';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';
import { ValidateAccountForm } from '../auth/ValidateAccountForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'rgba(10, 15, 30, 0.95)', // Darker, more opaque for readability but still fitting theme
  backdropFilter: 'blur(20px)', // Blur logic handled by backdrop usually, but this adds to the modal itself if supported
  border: '1px solid rgba(0, 243, 255, 0.3)',
  boxShadow: '0 0 30px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.05)',
  borderRadius: 4,
  p: 4,
  outline: 'none',
};

export const Modal = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isModalOpen, activeModalContent } = useAppSelector((state) => state.ui);

  const renderContent = () => {
    switch (activeModalContent) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'validate':
        return <ValidateAccountForm />;
      default:
        return children;
    }
  };

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
        <Box sx={style}>
          <IconButton
            onClick={() => dispatch(closeModal())}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
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
