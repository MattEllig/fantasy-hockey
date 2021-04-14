import * as React from 'react';
import { useTableSection } from '../../../contexts/TableSectionContext/TableSectionContext';

interface TableRowProps {
    children?: React.ReactNode;
}

function getTableRowStyles(section: string) {
    return section === 'body'
        ? 'hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors'
        : 'bg-gray-200 dark:bg-gray-700';
}

function TableRow({ children }: TableRowProps): JSX.Element {
    const section = useTableSection();

    return (
        <tr className={getTableRowStyles(section)}>
            {children}
        </tr>
    );
}

export default TableRow;
