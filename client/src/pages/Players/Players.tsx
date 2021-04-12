import * as React from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import GoalieTable from './components/GoalieTable/GoalieTable';
import SkaterTable from './components/SkaterTable/SkaterTable';

export interface PlayerFilters {
    page: number;
    pageSize: number;
    position: string;
    sort: {
        property: string;
        ascending: boolean;
    };
}

type PlayerFiltersAction =
    | { type: 'change_page', page: number }
    | { type: 'change_pageSize', pageSize: number }
    | { type: 'change_position', position: string }
    | { type: 'change_sort', property: string, ascending: boolean; };

function isDefaultSortAscending(key: string) {
    switch (key) {
        case 'currentTeam.abbreviation':
        case 'name.last':
        case 'positions':
        case 'stats.goalsAgainstAverage':
            return true;
        default:
            // most columns are descending by default to sort players with highest values to the top on 1st click
            return false;
    }
}

function reducer(state: PlayerFilters, action: PlayerFiltersAction): PlayerFilters {
    switch (action.type) {
        case 'change_page':
            return { ...state, page: action.page };
        case 'change_pageSize':
            localStorage.setItem(pageSizeKey, String(action.pageSize));
            return { ...state, page: 0, pageSize: action.pageSize };
        case 'change_position':
            // if changing position from S->G or vice versa, reset the sort back to the default to avoid incompatibility issues
            if (action.position === 'G' || state.position === 'G') {
                return {
                    ...state,
                    page: 0,
                    position: action.position,
                    sort: {
                        property: 'name.last',
                        ascending: true
                    }
                };
            }

            return { ...state, page: 0, position: action.position };
        case 'change_sort':
            return { ...state, sort: { property: action.property, ascending: action.ascending } };
        default:
            throw new Error('Unsupported action type');
    }
}

const pageSizeKey = 'f-hockey-pgsize';

function Players(): JSX.Element {
    const [filters, dispatch] = React.useReducer(reducer, {
        page: 0,
        pageSize: Number(localStorage.getItem(pageSizeKey) || '50'),
        position: 'All',
        sort: { property: 'name.last', ascending: true },
    });

    function handlePageChange(newPage: number) {
        if (newPage !== filters.page) {
            dispatch({ type: 'change_page', page: newPage });
        }
    }

    function handlePageSizeChange(newPageSize: number) {
        if (newPageSize !== filters.pageSize) {
            dispatch({ type: 'change_pageSize', pageSize: newPageSize });
        }
    }

    function handlePositionChange(newPosition: string) {
        if (newPosition !== filters.position) {
            dispatch({ type: 'change_position', position: newPosition });
        }
    }

    function handleSortChange(newSortProperty: string) {
        if (newSortProperty === filters.sort.property) {
            dispatch({ type: 'change_sort', property: newSortProperty, ascending: !filters.sort.ascending });
        } else {
            dispatch({ type: 'change_sort', property: newSortProperty, ascending: isDefaultSortAscending(newSortProperty) });
        }
    }

    return (
        <div className="flex flex-col max-w-screen-2xl mx-auto py-6">
            <div className="px-4 md:px-6 xl:px-8">
                <h2 className="mb-6 text-4xl font-thin tracking-wide">
                    Players
                </h2>
                <div className="grid grid-cols-12 mb-4">
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 2xl:col-span-2">
                        <Dropdown
                            items={[
                                { key: 'All', label: 'All skaters' },
                                { key: 'F', label: 'All forwards' },
                                { key: 'C', label: 'Centers' },
                                { key: 'LW', label: 'Left Wings' },
                                { key: 'RW', label: 'Right Wings' },
                                { key: 'D', label: 'Defensemen' },
                                { key: 'G', label: 'Goalies' },
                            ]}
                            label="Position"
                            onChange={handlePositionChange}
                        />
                    </div>
                </div>
            </div>
            {filters.position !== 'G' ? (
                <SkaterTable
                    filters={filters}
                    onChangePage={handlePageChange}
                    onChangePageSize={handlePageSizeChange}
                    onSort={handleSortChange}
                />
            ) : (
                <GoalieTable
                    filters={filters}
                    onChangePage={handlePageChange}
                    onChangePageSize={handlePageSizeChange}
                    onSort={handleSortChange}
                />
            )}
        </div>
    );
}

export default Players;
