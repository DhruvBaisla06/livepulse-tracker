import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        )}
        <input
          ref={ref}
          className={`
            w-full glass px-4 py-2.5 text-sm text-white/90 placeholder-white/30
            focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'ring-2 ring-red-500/40 border-red-500/40' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
