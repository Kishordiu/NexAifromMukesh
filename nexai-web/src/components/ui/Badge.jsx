import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ variant = 'neutral', size = 'md', children, className, pulse = false }) {
<<<<<<< HEAD
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant]), className)}>
      {pulse && (
        <span className="relative flex h-2 w-2 mr-2">
          <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[variant])}></span>
          <span className={clsx("relative inline-flex rounded-full h-2 w-2", dotColors[variant])}></span>
        </span>
      )}
      {children}
    </span>
  );
=======
 const baseStyles = 'inline-flex items-center font-medium rounded-full';
 
 const sizeStyles = {
 sm: 'text-xs px-2 py-0.5',
 md: 'text-sm px-2.5 py-1',
 };

 const variantStyles = {
 success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
 warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
 danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
 info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
 neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
 };

 const dotColors = {
 success: 'bg-emerald-500',
 warning: 'bg-amber-500',
 danger: 'bg-red-500',
 info: 'bg-blue-500',
 neutral: 'bg-gray-500',
 };

 return (
 <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant]), className)}>
 {pulse && (
 <span className="relative flex h-2 w-2 mr-2">
 <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[variant])}></span>
 <span className={clsx("relative inline-flex rounded-full h-2 w-2", dotColors[variant])}></span>
 </span>
 )}
 {children}
 </span>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}
