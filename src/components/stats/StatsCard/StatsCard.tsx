import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatsCard.css';

interface StatsCardProps {
    label: string;
    value: number | string;
    suffix?: string;
    index: number;
    clickable?: boolean;
}

export function StatsCard({ label, value, suffix = '', index, clickable = false }: StatsCardProps) {
    const [displayValue, setDisplayValue] = useState<number | string>(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef<HTMLParagraphElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Only animate numbers
        if (typeof value !== 'number') {
            setDisplayValue(value);
            return;
        }

        // Only animate once
        if (hasAnimated) {
            return;
        }

        setHasAnimated(true);
        animateValue(value);
    }, [value, hasAnimated]);

    // Check if value is overflowing
    useEffect(() => {
        const checkOverflow = () => {
            if (valueRef.current) {
                const isOverflow = valueRef.current.scrollWidth > valueRef.current.clientWidth;
                setIsOverflowing(isOverflow);
            }
        };

        // Check after value updates and on resize
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [displayValue]);

    const animateValue = (endValue: number) => {
        // Calculate duration based on value so all cards count at the same speed
        // Adjust the divisor to control counting speed (lower = faster)
        const duration = Math.max(1000, Math.min(endValue * 20, 100)); // Between 1-3 seconds
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
            }
        };

        requestAnimationFrame(animate);
    };

    const handleClick = () => {
        if (clickable) {
            navigate('/user');
        }
    };

    return (
        <div
            ref={cardRef}
            className={`stats-card ${clickable ? 'stats-card-clickable' : ''} ${isOverflowing ? 'stats-card-overflow' : ''}`}
            onClick={handleClick}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <p className="stats-card-label">{label}</p>
            <p ref={valueRef} className="stats-card-value">
                {displayValue}
            </p>
            {suffix && <span className="stats-card-suffix">{suffix}</span>}

        </div>
    );
}