'use client';

import React from 'react';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function Alert({ title, children, variant = 'default' }: AlertProps) {
  return (
    <div className={`p-4 rounded-lg border ${
      variant === 'destructive' 
        ? 'border-red-500/20 bg-red-500/10 text-red-500' 
        : 'border-black/20 bg-black/5 dark:border-white/20 dark:bg-white/5'
    }`}>
      {title && <h5 className="font-medium mb-1">{title}</h5>}
      <div className="text-sm">{children}</div>
    </div>
  );
} 
