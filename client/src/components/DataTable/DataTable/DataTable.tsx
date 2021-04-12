import * as React from 'react';

interface DataTableProps {
    children?: React.ReactNode;
}

function DataTable({ children }: DataTableProps): JSX.Element {
    return (
        <div className="overflow-x-auto md:-mx-6 xl:-mx-8">
            <div className="align-middle inline-block min-w-full md:px-6 xl:px-8">
                <div className="overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 font-mono">
                        {children}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DataTable;
