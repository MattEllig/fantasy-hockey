import * as React from 'react';
import { TableSectionProvider } from '../../../contexts/TableSectionContext/TableSectionContext';

interface TableBodyProps {
    children?: React.ReactNode;
}

function TableBody({ children }: TableBodyProps): JSX.Element {
    return (
        <TableSectionProvider value="body">
            <tbody className="divide-y divide-y-gray-200 dark:divide-gray-700 text-sm">
                {children}
            </tbody>
        </TableSectionProvider>
    );
}

export default TableBody;
