import { FC, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  isDismissable?: boolean;
  onDismiss?: () => void;
}

const alertIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />
};

const alertStyles: Record<AlertVariant, string> = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200'
};

const iconStyles: Record<AlertVariant, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500'
};

export const Alert: FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  isDismissable = false,
  onDismiss,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'border rounded-md p-4 flex',
        alertStyles[variant],
        className
      )}
      role="alert"
      {...props}
    >
      <div className={cn('mr-3', iconStyles[variant])}>
        {alertIcons[variant]}
      </div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {isDismissable && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn('p-1 rounded-md hover:bg-white/30', iconStyles[variant])}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};