import * as React from 'react';

interface TableContainerProps {
    children?: React.ReactNode;
}

function TableContainer({ children }: TableContainerProps): JSX.Element {
    return (
        <div className="md:px-6 xl:px-8">
            {children}
        </div>
    );
}

export default TableContainer;
