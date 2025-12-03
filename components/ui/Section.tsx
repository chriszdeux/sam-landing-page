import React from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const Section = ({ id, children, className }: SectionProps) => {
  return (
    <Box
      component={motion.section}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      sx={{ py: { xs: 8, md: 12 }, minHeight: '80vh', display: 'flex', alignItems: 'center' }}
      className={className}
    >
      <Container maxWidth="xl">
        {children}
      </Container>
    </Box>
  );
};
