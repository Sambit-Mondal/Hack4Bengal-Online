import { ReactNode, FC, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table: FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="table-container">
      <table className={cn('data-table', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: ReactNode;
}

export const TableHeader: FC<TableHeaderProps> = ({ children }) => {
  return <thead>{children}</thead>;
};

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody: FC<TableBodyProps> = ({ children }) => {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>;
};

interface TableRowProps {
  children: ReactNode;
}

export const TableRow: FC<TableRowProps> = ({ children }) => {
  return <tr>{children}</tr>;
};

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableHead: FC<TableHeadProps> = ({ children, className, ...props }) => {
  return (
    <th className={cn(className)} {...props}>
      {children}
    </th>
  );
};

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableCell: FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td className={cn(className)} {...props}>
      {children}
    </td>
  );
};