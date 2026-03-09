'use client';

import { ReactNode } from 'react';

interface ChartWrapperProps {
  children: ReactNode;
  height?: number;
  className?: string;
}

/**
 * Wrapper component to ensure charts render with proper dimensions
 * Prevents the "width(-1) and height(-1)" error in Recharts
 */
export default function ChartWrapper({ 
  children, 
  height = 300, 
  className = "" 
}: ChartWrapperProps) {
  return (
    <div 
      className={`w-full min-h-[${height}px] h-[${height}px] ${className}`}
      style={{ minHeight: height, height: height }}
    >
      {children}
    </div>
  );
}