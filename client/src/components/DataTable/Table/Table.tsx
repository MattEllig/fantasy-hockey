import * as React from 'react';

interface TableProps {
    children?: React.ReactNode;
}

function Table({ children }: TableProps): JSX.Element {
    return (
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 font-mono">
                        {children}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Table;
