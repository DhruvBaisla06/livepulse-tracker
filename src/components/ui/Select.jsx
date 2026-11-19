import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ label, error, options = [], placeholder = 'Select...', className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full glass px-4 py-2.5 text-sm text-white/90 appearance-none
            bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/40
            transition-all duration-200 cursor-pointer
            ${error ? 'ring-2 ring-red-500/40' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" className="bg-navy-800 text-white/50">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-navy-800 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
