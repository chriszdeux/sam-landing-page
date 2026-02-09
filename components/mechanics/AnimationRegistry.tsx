import React from 'react';
import { MarketAnimation } from './MarketAnimation';
import { MiningAnimation } from './MiningAnimation';
import { PortfolioAnimation } from './PortfolioAnimation';
import { TransactionsAnimation } from './TransactionsAnimation';

export type AnimationComponentProps = {
    color: string;
    variant?: string;
};

import { Box } from '@mui/material';

export const AnimationRegistry: Record<string, React.FC<AnimationComponentProps>> = {
    'market-candles': (props) => <MarketAnimation color={props.color} />,
    'mining-bg': (props) => <MiningAnimation color={props.color} />,
    'transactions-bg': (props) => (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, filter: 'blur(3px)', opacity: 0.4 }}>
            <TransactionsAnimation color={props.color} />
        </Box>
    ),
    'portfolio-balance': (props) => <PortfolioAnimation color={props.color} variant="balance" />,
    'portfolio-inventory': (props) => <PortfolioAnimation color={props.color} variant="inventory" />,
    'portfolio-stats': (props) => <PortfolioAnimation color={props.color} variant="stats" />,
};
