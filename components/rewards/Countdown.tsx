import React from 'react';
import { Typography } from '../ui/Typography';

interface CountdownProps {
    targetDate: number;
    onComplete?: () => void;
}

export const Countdown = ({ targetDate, onComplete }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetDate - Date.now();
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('');
                if (onComplete) onComplete();
            }
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft) return null;

    return (
        <div className="mt-1 mb-1 inline-block rounded border border-white/10 bg-black/60 px-3 py-1">
            <Typography variant="caption" className="font-mono font-bold text-[#00e676]">
                {timeLeft}
            </Typography>
        </div>
    );
};
