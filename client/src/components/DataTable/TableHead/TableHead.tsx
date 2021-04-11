import * as React from 'react';
import { TableSectionProvider } from '../../../contexts/TableSectionContext/TableSectionContext';

interface TableHeadProps {
    children?: React.ReactNode;
}

function TableHead({ children }: TableHeadProps): JSX.Element {
    return (
        <TableSectionProvider value="head">
            <thead className="bg-gray-200 dark:bg-gray-700">
                {children}
            </thead>
        </TableSectionProvider>
    );
}

export default TableHead;
