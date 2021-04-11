import * as React from 'react';
import { useTableSection } from '../../../contexts/TableSectionContext/TableSectionContext';

interface TableRowProps {
    children?: React.ReactNode;
}

function TableRow({ children }: TableRowProps): JSX.Element {
    const section = useTableSection();

    return (
        <tr className={section === 'body' ? 'hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white transition-colors' : undefined}>
            {children}
        </tr>
    );
}

export default TableRow;
