import { FC, useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

type NotificationType = 'success' | 'error' | 'loading';

interface NotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="h-6 w-6 text-white" />,
  error: <XCircle className="h-6 w-6 text-white" />,
  loading: (
    <div className="h-6 w-6 rounded-full border-2 border-t-white border-r-white border-b-white border-l-transparent animate-spin" />
  ),
};

const notificationColors: Record<NotificationType, string> = {
  success: 'bg-success-500',
  error: 'bg-error-500',
  loading: 'bg-primary-500',
};

export const Notification: FC<NotificationProps> = ({
  type,
  message,
  description,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in">
      <div className="rounded-lg shadow-lg overflow-hidden">
        <div className={cn('p-4 flex items-start', notificationColors[type])}>
          <div className="flex-shrink-0">
            {notificationIcons[type]}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-white font-medium">{message}</p>
            {description && (
              <p className="mt-1 text-white opacity-90 text-sm">{description}</p>
            )}
          </div>
          {type !== 'loading' && (
            <button 
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
              className="flex-shrink-0 text-white hover:text-gray-200 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};