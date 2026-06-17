'use client';

import React from 'react';
import { useLabSimulation } from '../../lib/features/labs/useLabSimulation';
import { EnergyWidget } from '../dashboard/EnergyWidget';

export const LabSimulationManager = () => {
    useLabSimulation();
    return <EnergyWidget />;
};
