'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { Typography } from '../ui/Typography';
import { Tooltip } from '../ui/Tooltip';
import { formatHash } from '../../lib/utils/formatHash';

export const LabNavbarIndicator = () => {
    const indicatorData = useAppSelector((state: RootState) => {
        const selectedNetwork = state.blockchain.selectedNetwork;
        return {
            hashAvailable: selectedNetwork?.hashAvailable ?? 0,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            chronoBurstFreqTypes: state.blockchain.chronoBurstFreqTypes
        };
    }, (prev, next) => {
        if (prev === null && next === null) return true;
        if (prev === null || next === null) return false;
        return (
            prev.hashAvailable === next.hashAvailable &&
            prev.isPoweredOn === next.isPoweredOn &&
            prev.chronoBurstFreqTypes === next.chronoBurstFreqTypes
        );
    });

    if (!indicatorData) return null;

    const { hashAvailable, isPoweredOn, chronoBurstFreqTypes } = indicatorData;
    const formattedHash = formatHash(hashAvailable, chronoBurstFreqTypes);

    return (
        <Tooltip content={`Hash Disponible: ${formattedHash}`}>
            <div className="flex cursor-default items-center gap-2 rounded border border-white/5 bg-white/[0.03] px-3 py-1">
                <motion.div
                    animate={isPoweredOn ? {
                        color: ['#00f3ff', '#fff', '#00f3ff'],
                        scale: [1, 1.1, 1]
                    } : { color: 'rgba(255,255,255,0.2)' }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <Zap size={18} />
                </motion.div>

                <div className="flex items-center">
                    <Typography variant="caption" className="font-mono text-xs font-bold text-[#00f3ff]">
                        {formattedHash}
                    </Typography>
                </div>
            </div>
        </Tooltip>
    );
};
