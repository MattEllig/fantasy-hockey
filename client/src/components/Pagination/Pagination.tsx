import clsx from 'clsx';
import * as React from 'react';
import useControlledState from '../../hooks/useControlledState/useControlledState';

export interface PageChangeHandler {
    (newPage: number): void;
}

export interface PageSizeChangeHandler {
    (newPageSize: number): void;
}

interface PaginationProps {
    itemsLabel?: string;
    onChangePage?: PageChangeHandler;
    onChangePageSize?: PageSizeChangeHandler;
    page: number;
    pageSize: number;
    pageSizes: number[];
    totalItems: number;
}

function getNavigationButtonStyles(disabled: boolean) {
    return clsx(
        'relative flex items-center justify-center p-4 align-middle focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 transition',
        !disabled && 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white',
        disabled && 'opacity-50 cursor-not-allowed'
    );
}

function getSelectStyles(disabled: boolean) {
    return clsx(
        'relative h-12 pl-4 pr-8 border-none bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:z-10 transition',
        !disabled && 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
    );
}

function Pagination({
    page: pageProp,
    pageSize: pageSizeProp,
    itemsLabel = 'items',
    onChangePage,
    onChangePageSize,
    pageSizes,
    totalItems,
}: PaginationProps): JSX.Element {
    const [page, setPage] = useControlledState(pageProp);
    const [pageSize, setPageSize] = useControlledState(pageSizeProp);

    const pageCount = Math.trunc(Math.ceil(totalItems / pageSize));

    const disablePrev = page <= 0;
    const disableNext = page >= pageCount;
    const disablePageSelect = totalItems === 0;

    function goToPage(newPage: number) {
        if (page < 0 || page > pageCount) return;

        setPage(newPage);

        if (onChangePage) {
            onChangePage(newPage);
        }
    }

    function handlePageChange(event: React.ChangeEvent<HTMLSelectElement>) {
        goToPage(Number(event.currentTarget.value));
    }

    function handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newPageSize = Number(event.currentTarget.value);

        setPageSize(newPageSize);

        if (onChangePageSize) {
            onChangePageSize(newPageSize);
        }
    }

    return (
        <div className="flex items-center justify-between flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
            <div className="hidden md:flex items-center pl-4">
                <label htmlFor="page-size" className="block pr-2 text-sm">
                    <span className="capitalize">{itemsLabel}</span>
                    &nbsp;per page:
                </label>
                <select
                    id="page-size"
                    onChange={handlePageSizeChange}
                    value={pageSize}
                    className={getSelectStyles(false)}
                >
                    {pageSizes.map((size) => <option key={size}>{size}</option>)}
                </select>
            </div>
            <div className="flex-grow px-4 py-3.5 text-sm">
                {totalItems > 0 ? (`${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalItems)} of ${totalItems} ${itemsLabel}`) : (`0 ${itemsLabel}`)}
            </div>
            <div className="hidden md:flex items-center flex-shrink-0 pr-4">
                <label htmlFor="current-page" className="sr-only">Page:</label>
                <select
                    disabled={disablePageSelect}
                    id="current-page"
                    onChange={handlePageChange}
                    value={page}
                    className={getSelectStyles(disablePageSelect)}
                >
                    {totalItems === 0 || pageCount === 0 ? <option>1</option> : <>{[...Array(pageCount).keys()].map((page) => <option key={page} value={page}>{page + 1}</option>)}</>}
                </select>
                <span className="block pl-2 text-sm">of {pageCount} pages</span>
            </div>
            <div className="flex flex-shrink-0 divide-x divide-gray-200 dark:divide-gray-700">
                <button
                    disabled={disablePrev}
                    onClick={() => goToPage(page - 1)}
                    type="button"
                    className={getNavigationButtonStyles(disablePrev)}
                    aria-label="Previous page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    disabled={disableNext}
                    onClick={() => goToPage(page + 1)}
                    type="button"
                    className={getNavigationButtonStyles(disableNext)}
                    aria-label="Next page"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Pagination;
