import { FC, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'border';
}

export const Card: FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const baseClasses = "bg-white rounded-lg";
  
  const variantClasses = {
    default: "shadow-card",
    hover: "shadow-card hover:shadow-card-hover transition-shadow",
    border: "border border-gray-200"
  };
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn("mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3 
      className={cn("text-xl font-bold", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p 
      className={cn("text-text-secondary mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn("mt-4 pt-4 border-t border-gray-100 flex justify-end", className)}
      {...props}
    >
      {children}
    </div>
  );
};