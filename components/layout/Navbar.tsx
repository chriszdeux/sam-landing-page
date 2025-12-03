import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Stack, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Rocket, Person as UserIcon, AccountBalanceWallet } from '@mui/icons-material';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { setCurrentSection, openModal } from '../../lib/features/uiSlice';
import { logout, connectWallet, disconnectWallet } from '../../lib/features/authSlice';

const navItems = [
  { name: 'Inicio', id: 'home' },
  { name: 'Historia', id: 'history' },
  { name: 'Mecánicas', id: 'mechanics' },
  { name: 'Recursos', id: 'resources' },
  { name: 'Arquitectura', id: 'architecture' },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { userInfo, walletAddress } = useAppSelector((state) => state.auth);

  const handleConnectWallet = () => {
    if (walletAddress) {
      dispatch(disconnectWallet());
    } else {
      dispatch(connectWallet());
    }
  };

  const handleNavClick = (id: string) => {
    dispatch(setCurrentSection(id));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        PROYECTO SAM
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding onClick={() => handleNavClick(item.id)}>
            <ListItemText primary={item.name} sx={{ textAlign: 'center' }} />
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {userInfo ? (
              <>
                <Typography variant="body2" sx={{ color: 'primary.main', mb: 1 }}>
                  Hola, {userInfo.name}
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => dispatch(logout())}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" fullWidth onClick={() => { dispatch(openModal('login')); setMobileOpen(false); }}>
                  Entrar
                </Button>
                <Button variant="contained" fullWidth onClick={() => { dispatch(openModal('register')); setMobileOpen(false); }}>
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
            <Rocket sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              PROYECTO SAM
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button key={item.id} variant="text" onClick={() => handleNavClick(item.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                {item.name}
              </Button>
            ))}

            {userInfo ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <UserIcon fontSize="small" />
                  {userInfo.name}
                </Typography>
                <Button variant="text" size="small" onClick={() => dispatch(logout())}>
                  Salir
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button variant="text" size="small" onClick={() => dispatch(openModal('login'))}>
                  Entrar
                </Button>
                <Button variant="contained" size="small" onClick={() => dispatch(openModal('register'))}>
                  Registrarse
                </Button>
              </Stack>
            )}
            {/* <Button
              variant="outlined"
              size="small"
              onClick={handleConnectWallet}
              startIcon={<AccountBalanceWallet />}
              sx={{
                borderColor: walletAddress ? 'primary.main' : 'rgba(255,255,255,0.3)',
                color: walletAddress ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  boxShadow: '0 0 10px rgba(0, 243, 255, 0.3)',
                }
              }}
            >
              {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : 'Connect Wallet'}
            </Button> */}
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: 'background.default' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};
