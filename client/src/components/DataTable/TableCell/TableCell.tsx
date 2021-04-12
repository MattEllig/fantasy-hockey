import * as React from 'react';
import { useTableSection } from '../../../contexts/TableSectionContext/TableSectionContext';
import clsx from 'clsx';

interface TableCellProps {
    align?: 'left' | 'center' | 'right' | string;
    children?: React.ReactNode;
    colSpan?: number;
}

function getTableCellStyles(align: string | undefined, section: string) {
    const textAlign = align === 'center' ? 'text-center' : (align === 'right' ? 'text-right' : 'text-left');

    return clsx(
        'overflow-hidden overflow-ellipsis px-4 text-sm',
        section === 'head' ? 'py-3.5 font-bold text-gray-800 dark:text-gray-100' : 'py-2.5',
        textAlign,
    );
}

function TableCell({ align, children, ...other }: TableCellProps): JSX.Element {
    const section = useTableSection();

    const CellType = section === 'head' ? 'th' : 'td';

    const styles = getTableCellStyles(align, section);

    return (
        <CellType {...other} className={styles}>
            {children}
        </CellType>
    );
}

export default TableCell;
