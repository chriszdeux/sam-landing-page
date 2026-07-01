'use client';

import React from 'react';
import { useLabSimulation } from '../../lib/features/labs/useLabSimulation';

export const LabSimulationManager = () => {
    useLabSimulation();
    return null;
};
