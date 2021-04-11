import * as React from 'react';

interface TableSectionProviderProps {
    children?: React.ReactNode;
    value: 'head' | 'body' | 'foot';
}

const TableSectionContext = React.createContext<string | undefined>(undefined);

function TableSectionProvider({ children, value }: TableSectionProviderProps): JSX.Element {
    return (
        <TableSectionContext.Provider value={value}>
            {children}
        </TableSectionContext.Provider>
    );
}

function useTableSection(): string {
    const context = React.useContext(TableSectionContext);

    if (context === undefined) {
        throw new Error('useTableSection must be used within a TableSectionProvider');
    }

    return context;
}

export { TableSectionProvider, useTableSection };
