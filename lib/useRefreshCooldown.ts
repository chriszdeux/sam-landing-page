import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { triggerGlobalRefresh } from './features/uiSlice';

export function useRefreshCooldown() {
  const dispatch = useAppDispatch();
  const lastRefreshTime = useAppSelector((state) => state.ui.lastRefreshTime);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkCooldown = () => {
      if (!lastRefreshTime) {
        setCooldownRemaining(0);
        return;
      }
      const elapsedSeconds = Math.floor((Date.now() - lastRefreshTime) / 1000);
      const remaining = Math.max(0, 30 - elapsedSeconds);
      setCooldownRemaining(remaining);
      
      if (remaining === 0 && interval) {
        clearInterval(interval);
      }
    };

    checkCooldown();
    interval = setInterval(checkCooldown, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lastRefreshTime]);

  const triggerRefresh = () => {
    if (cooldownRemaining === 0) {
      dispatch(triggerGlobalRefresh());
      return true;
    }
    return false;
  };

  return {
    isCooldownActive: cooldownRemaining > 0,
    cooldownRemaining,
    triggerRefresh
  };
}
