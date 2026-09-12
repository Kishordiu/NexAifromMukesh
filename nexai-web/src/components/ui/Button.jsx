import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
 children,
 variant = 'primary',
 size = 'md',
 isLoading = false,
 disabled = false,
 className = '',
 onClick,
 type = 'button',
 ...props
}) {
 const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-[14px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
 
 const sizeClasses = {
 sm: "px-3 py-1.5 text-sm",
 md: "px-5 py-2.5 text-base",
 lg: "px-6 py-3.5 text-lg",
 icon: "p-2",
 };

 const variants = {
 primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_14px_rgba(59,130,246,0.39)] focus:ring-blue-500",
 secondary: "bg-white/60 hover:bg-white/80 text-slate-700 border border-white/70 shadow-sm backdrop-blur-md focus:ring-slate-300",
 ghost: "bg-transparent hover:bg-slate-100/50 text-slate-600 focus:ring-slate-200",
 danger: "bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.39)] focus:ring-red-500",
 emergency: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_8px_30px_rgba(225,29,72,0.4)] focus:ring-rose-500",
 };

 return (
 <motion.button
 type={type}
 className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
 onClick={onClick}
 disabled={disabled || isLoading}
 whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
 {...props}
 >
 {isLoading ? (
 <span className="absolute inset-0 flex items-center justify-center">
 <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 </span>
 ) : null}
 <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
 </motion.button>
 );
}
