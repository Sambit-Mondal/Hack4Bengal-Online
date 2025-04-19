import { FC, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  floatingLabel?: boolean;
}

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, floatingLabel = false, ...props }, ref) => {
    if (floatingLabel) {
      return (
        <div className="form-group">
          <div className="float-label">
            <input
              className={cn(
                "input-field",
                error && "border-error-500 focus:ring-error-500",
                icon && "pl-10",
                className
              )}
              placeholder=" "
              ref={ref}
              {...props}
            />
            {label && <label>{label}</label>}
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
              </div>
            )}
          </div>
          {error && <p className="text-error-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <div className="relative">
          <input
            className={cn(
              "input-field",
              error && "border-error-500 focus:ring-error-500",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-error-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';