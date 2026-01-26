'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { checkAuth, fetchWalletDetails } from '../../lib/features/auth';
import { fetchNetworks, fetchRewards } from '../../lib/features/blockchain/actions';

export const AuthLoader = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);

    // Initial Load
    useEffect(() => {
        dispatch(checkAuth());
        dispatch(fetchNetworks());
        dispatch(fetchRewards());
    }, []);

    useEffect(() => {
         if (userInfo && userInfo.wallets && userInfo.wallets.length > 0) {
            const primaryWallet = userInfo.wallets[0];
            if (!primaryWallet.details) {
                 dispatch(fetchWalletDetails(primaryWallet.walletAddress));
            }
        }
    }, [userInfo]);

    return <>{children}</>;
};
