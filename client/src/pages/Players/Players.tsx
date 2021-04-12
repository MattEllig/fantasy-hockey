import * as React from 'react';
import axios from 'axios';
import SkaterTable from './components/SkaterTable/SkaterTable';
import Pagination from '../../components/Pagination/Pagination';
import { Goalie, Skater } from '../../types';
import Dropdown from '../../components/Dropdown/Dropdown';
import GoalieTable from './components/GoalieTable/GoalieTable';
import { TableContainer } from '../../components/DataTable';

interface PlayerFilters {
    page: number;
    pageSize: number;
    position: string;
}

type PlayerFiltersAction =
    | { type: 'change_page', page: number }
    | { type: 'change_pageSize', pageSize: number }
    | { type: 'change_position', position: string };

interface PlayerQueryResult {
    results: Skater[] | Goalie[];
    totalItems: number;
}

function reducer(state: PlayerFilters, action: PlayerFiltersAction): PlayerFilters {
    switch (action.type) {
        case 'change_page':
            return { ...state, page: action.page };
        case 'change_pageSize':
            localStorage.setItem(pageSizeKey, String(action.pageSize));
            return { ...state, pageSize: action.pageSize };
        case 'change_position':
            return { ...state, page: 0, position: action.position };
        default:
            throw new Error('Unsupported action type');
    }
}

const pageSizeKey = 'f-hockey-psize';

function Players(): JSX.Element {
    const [loading, setLoading] = React.useState(false);
    const [players, setPlayers] = React.useState<PlayerQueryResult>({ results: [], totalItems: 0 });

    const [filters, dispatch] = React.useReducer(reducer, {
        page: 0,
        pageSize: Number(localStorage.getItem(pageSizeKey) || '50'),
        position: 'All'
    });

    React.useEffect(() => {
        const source = axios.CancelToken.source();

        let isMounted = true;

        async function getPlayers() {
            setLoading(true);

            try {
                const response = await axios.get('/api/player', {
                    cancelToken: source.token,
                    params: {
                        page: filters.page,
                        pageSize: filters.pageSize,
                        position: filters.position,
                    }
                });

                setPlayers(response.data);
            } catch (error) {
                if (!isMounted || axios.isCancel(error)) return;

                console.error('Error fetching players:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getPlayers();

        return () => {
            isMounted = false;
            source.cancel();
        };
    }, [filters]);

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
            // clear incompatible results arrays when switching from S->G or vice versa
            if (newPosition === 'G' || filters.position === 'G') {
                setPlayers({ results: [], totalItems: 0 });
            }

            dispatch({ type: 'change_position', position: newPosition });
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
            <TableContainer>
                {filters.position !== 'G' ? (
                    <SkaterTable loading={loading} pageSize={filters.pageSize} players={players.results as Skater[]} />
                ) : (
                    <GoalieTable loading={loading} pageSize={filters.pageSize} players={players.results as Goalie[]} />
                )}
                <Pagination
                    itemsLabel="players"
                    onChangePage={handlePageChange}
                    onChangePageSize={handlePageSizeChange}
                    page={filters.page}
                    pageSize={filters.pageSize}
                    pageSizes={[10, 25, 50, 100]}
                    totalItems={players.totalItems}
                />
            </TableContainer>
        </div>
    );
}

export default Players;
