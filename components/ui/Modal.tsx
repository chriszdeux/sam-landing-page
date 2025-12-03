import React from 'react';
import { Modal as MuiModal, Box, IconButton, Fade, Backdrop } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { closeModal } from '../../lib/features/uiSlice';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';
import { ValidateAccountForm } from '../auth/ValidateAccountForm';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  border: '1px solid #00f3ff',
  boxShadow: '0 0 20px #00f3ff',
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
