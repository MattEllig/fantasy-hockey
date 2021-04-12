import * as React from 'react';
import clsx from 'clsx';

interface TableCellProps {
    children?: React.ReactNode;
    colSpan?: number;
    numeric?: boolean;
}

function getTableCellStyles(numeric: boolean) {
    return clsx(
        'overflow-hidden overflow-ellipsis px-4 text-sm py-2.5',
        numeric ? 'text-right' : 'text-left'
    );
}

function TableCell({ children, numeric = false, ...other }: TableCellProps): JSX.Element {
    const styles = getTableCellStyles(numeric);

    return (
        <td {...other} className={styles}>
            {children}
        </td>
    );
}

export default TableCell;
