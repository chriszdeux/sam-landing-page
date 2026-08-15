// 1-Lógica principal y renderizado del módulo

import React from 'react';
import { MarketAnimation } from './MarketAnimation';
import { MiningAnimation } from './MiningAnimation';
import { PortfolioAnimation } from './PortfolioAnimation';
import { TransactionsAnimation } from './TransactionsAnimation';

export type AnimationComponentProps = {
    color: string;
    variant?: string;
};

export const AnimationRegistry: Record<string, React.FC<AnimationComponentProps>> = {
    'market-candles': (props) => <MarketAnimation color={props.color} />,
    'mining-bg': (props) => <MiningAnimation color={props.color} />,
    'transactions-bg': (props) => (
        <div className="absolute inset-0 z-0 opacity-40 blur-[3px]">
            <TransactionsAnimation color={props.color} />
        </div>
    ),
    'portfolio-balance': (props) => <PortfolioAnimation color={props.color} variant="balance" />,
    'portfolio-inventory': (props) => <PortfolioAnimation color={props.color} variant="inventory" />,
    'portfolio-stats': (props) => <PortfolioAnimation color={props.color} variant="stats" />,
};
