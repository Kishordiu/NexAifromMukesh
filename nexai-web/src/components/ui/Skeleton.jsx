import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/60',
          className
        )
      )}
      {...props}
    />
  );
}
