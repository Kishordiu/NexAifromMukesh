import React from 'react';
import { clsx } from 'clsx';

export function StatusIndicator({ status = 'offline', label }) {
  const styles = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    syncing: 'bg-blue-500 animate-pulse',
    error: 'bg-red-500',
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={clsx('h-2.5 w-2.5 rounded-full', styles[status])} />
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </div>
  );
}
