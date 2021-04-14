import clsx from 'clsx';
import * as React from 'react';
import { TableSortHandler } from '../DataTable/DataTable';

export interface TableHeaderProps {
    active?: boolean;
    children?: React.ReactNode;
    colSpan?: number;
    direction?: 'ascending' | 'descending';
    numeric?: boolean;
    onSort?: TableSortHandler;
    sortId?: string;
}

function getSortIconStyles(active: boolean, numeric: boolean) {
    return clsx(
        'flex items-center',
        numeric ? '-ml-2 pr-2' : '-mr-2 pl-2',
        active ? 'opacity-75' : 'opacity-0 group-hover:opacity-75 group-focus:opacity-75'
    );
}

function getTableHeaderStyles(sortable: boolean, active: boolean, numeric: boolean) {
    return clsx(
        'group relative flex items-center justify-between px-4 py-2.5 focus:outline-none',
        numeric && 'flex-row-reverse',
        sortable && !active && 'hover:bg-gray-300 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors',
        sortable && active && 'bg-gray-300 text-black dark:bg-gray-600 dark:text-white cursor-pointer'
    );
}

function TableHeader({
    children,
    direction = 'ascending',
    active = false,
    numeric = false,
    onSort,
    sortId,
    ...other
}: TableHeaderProps): JSX.Element {
    const sortable = onSort !== undefined;

    const headerStyles = getTableHeaderStyles(sortable, active, numeric);
    const iconStyles = getSortIconStyles(active, numeric);

    function handleClick() {
        if (onSort && sortId) {
            onSort(sortId);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLTableCellElement>) {
        if ((event.key === 'Enter' || event.key === ' ') && onSort && sortId) {
            event.preventDefault();

            onSort(sortId);
        }
    }

    return (
        <th
            {...other}
            className="overflow-hidden overflow-ellipsis font-bold text-left text-sm text-gray-800 dark:text-gray-100"
            aria-sort={active ? direction : undefined}
        >
            <div
                className={headerStyles}
                onClick={sortable ? handleClick : undefined}
                onKeyDown={sortable ? handleKeyDown : undefined}
                tabIndex={sortable ? 0 : undefined}
                role={sortable ? 'button' : undefined}
            >
                {children}
                {sortable ? (
                    <>
                        {active ? <span className="sr-only">(sorted {direction})</span> : null}
                        <span className={iconStyles} aria-hidden="true">
                            {active ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform ${direction === 'descending' ? 'rotate-180' : 'rotate-0'} transition-transform`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                                </svg>
                            )}
                        </span>
                        <div className="absolute inset-px group-focus:ring-2 group-focus:ring-blue-500 transition-shadow" />
                    </>
                ) : null}
            </div>
        </th>
    );
}

export default TableHeader;
