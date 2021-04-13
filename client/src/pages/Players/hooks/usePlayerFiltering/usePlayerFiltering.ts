import * as React from 'react';

export interface PlayerFilters {
    page: number;
    pageSize: number;
    position: string;
    search?: string;
    sort: {
        property: string;
        ascending: boolean;
    };
    team?: string;
}

interface PlayerFilterState {
    filters: PlayerFilters;
    changePage: (newPage: number) => void;
    changePageSize: (newPageSize: number) => void;
    changePosition: (newPosition: string) => void;
    changeSearch: (newSearch: string) => void;
    changeSort: (newSort: string) => void;
    changeTeam: (newTeam: string) => void;
}

type PlayerFiltersAction =
    | { type: 'change_page', page: number }
    | { type: 'change_pageSize', pageSize: number }
    | { type: 'change_position', position: string }
    | { type: 'change_search', search: string }
    | { type: 'change_sort', property: string, ascending: boolean; }
    | { type: 'change_team', team: string };

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
        case 'change_search':
            return { ...state, page: 0, search: action.search };
        case 'change_sort':
            return { ...state, sort: { property: action.property, ascending: action.ascending } };
        case 'change_team':
            return { ...state, page: 0, team: action.team };
        default:
            throw new Error('Unsupported action type');
    }
}

const pageSizeKey = 'f-hockey-pgsize';

function usePlayerFiltering(): PlayerFilterState {
    const [filters, dispatch] = React.useReducer(reducer, {
        page: 0,
        pageSize: Number(localStorage.getItem(pageSizeKey) || '50'),
        position: 'All',
        sort: { property: 'name.last', ascending: true },
    });

    function changePage(newPage: number) {
        if (newPage !== filters.page) {
            dispatch({ type: 'change_page', page: newPage });
        }
    }

    function changePageSize(newPageSize: number) {
        if (newPageSize !== filters.pageSize) {
            dispatch({ type: 'change_pageSize', pageSize: newPageSize });
        }
    }

    function changePosition(newPosition: string) {
        if (newPosition !== filters.position) {
            dispatch({ type: 'change_position', position: newPosition });
        }
    }

    function changeSearch(newSearch: string) {
        if (newSearch !== filters.search) {
            dispatch({ type: 'change_search', search: newSearch });
        }
    }

    function changeSort(newSortProperty: string) {
        if (newSortProperty === filters.sort.property) {
            dispatch({ type: 'change_sort', property: newSortProperty, ascending: !filters.sort.ascending });
        } else {
            dispatch({ type: 'change_sort', property: newSortProperty, ascending: isDefaultSortAscending(newSortProperty) });
        }
    }

    function changeTeam(newTeam: string) {
        if (newTeam !== filters.team) {
            dispatch({ type: 'change_team', team: newTeam });
        }
    }

    return {
        filters,
        changePage,
        changePageSize,
        changePosition,
        changeSearch,
        changeSort,
        changeTeam,
    };
}

export default usePlayerFiltering;
