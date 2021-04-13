import * as React from 'react';
import { TableHeaderProps } from '../TableHeader/TableHeader';

export interface TableSortHandler {
    (key: string): void;
}

interface TableHeaderData {
    colSpan?: number;
    header: string;
    key: string;
    notSortable?: boolean;
    numeric?: boolean;
}

interface DataTableProps {
    activeSortDirection?: 'ascending' | 'descending';
    activeSortKey?: string;
    children?:
    | React.ReactNode
    | ((props: { getTableHeaderProps: (header: TableHeaderData) => TableHeaderProps }) => React.ReactNode);
    onSort?: TableSortHandler;
}

function DataTable({ activeSortDirection, activeSortKey, children, onSort }: DataTableProps): JSX.Element {
    function getTableHeaderProps(header: TableHeaderData): TableHeaderProps {
        return {
            active: !header.notSortable && activeSortKey === header.key,
            colSpan: header.colSpan,
            direction: header.notSortable ? undefined : activeSortDirection,
            numeric: header.numeric,
            onSort: header.notSortable ? undefined : onSort,
            sortId: header.key,
        };
    }

    return (
        <div className="overflow-x-auto md:-mx-6 xl:-mx-8">
            <div className="align-middle inline-block min-w-full md:px-6 xl:px-8">
                <div className="overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <table className="min-w-full font-mono">
                        {typeof children === 'function' ? children({ getTableHeaderProps }) : children}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DataTable;
